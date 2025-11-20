import { create } from 'zustand';

const useBuilderStore = create((set, get) => ({
  // ============ STATE ============
  availableParts: [],
  installedParts: [],
  errors: [],
  selectedNode: null,
  isLoading: false,
  saveStatus: 'idle', // idle | saving | success | error
  
  // ============ COMPUTED STATS ============
  systemStats: {
    totalCost: 0,
    totalWattage: 0,
    workstationScore: 0,
    gamingScore: 0,
    powerEfficiency: 100
  },

  // ============ ACTIONS ============
  
  fetchParts: async () => {
    set({ isLoading: true });
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/parts`);
      if (!response.ok) throw new Error('Failed to fetch parts');
      
      const data = await response.json();
      set({ availableParts: data, isLoading: false });
    } catch (error) {
      console.error("❌ Error loading parts:", error);
      set({ errors: [{ id: Date.now(), message: "API Error: Could not load parts", severity: 'critical' }], isLoading: false });
    }
  },

  // 💾 ACTION SAUVEGARDE
  saveBuild: async (buildName) => {
    set({ saveStatus: 'saving' });
    try {
      const state = get();
      const payload = {
        name: buildName,
        parts: state.installedParts,
        stats: state.systemStats
      };

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/builds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Save failed');
      
      const savedBuild = await response.json();
      console.log("✅ Build saved:", savedBuild);
      set({ saveStatus: 'success' });
      
      // Reset status after 3 seconds
      setTimeout(() => set({ saveStatus: 'idle' }), 3000);
      return true;
    } catch (error) {
      console.error("❌ Error saving build:", error);
      set({ saveStatus: 'error', errors: [...get().errors, { id: Date.now(), message: "Failed to save to Cloud", severity: 'error' }] });
      return false;
    }
  },

  addPart: (part, targetNode) => {
    const state = get();
    const errors = [];

    if (targetNode) {
      const isValidSlot = validateSlotCompatibility(part, targetNode);
      if (!isValidSlot) {
        errors.push({ id: Date.now(), type: 'slot_mismatch', message: `${part.name} cannot be installed in ${targetNode.type}`, severity: 'error' });
        set({ errors });
        return false;
      }
    }

    if (part.type === 'cpu') {
      const motherboard = state.installedParts.find(p => p.type === 'motherboard');
      if (motherboard && motherboard.specs.socket !== part.specs.socket) {
        errors.push({ id: Date.now(), type: 'socket_mismatch', message: `Incompatible Socket: ${part.specs.socket} vs ${motherboard.specs.socket}`, severity: 'error' });
        set({ errors });
        return false;
      }
    }

    const exclusiveTypes = ['cpu', 'gpu', 'motherboard', 'case', 'psu'];
    if (exclusiveTypes.includes(part.type)) {
      const existing = state.installedParts.find(p => p.type === part.type);
      if (existing) {
        errors.push({ id: Date.now(), type: 'duplicate', message: `Remove existing ${part.type} first.`, severity: 'warning' });
        set({ errors });
        return false;
      }
    }

    const newPart = { ...part, installedAt: Date.now(), nodeId: targetNode?.id };
    const newInstalledParts = [...state.installedParts, newPart];
    const newStats = calculateSystemStats(newInstalledParts);
    
    const psu = newInstalledParts.find(p => p.type === 'psu');
    if (psu && newStats.totalWattage > psu.specs.max_wattage) {
      errors.push({ id: Date.now(), type: 'power_overload', message: `⚠️ POWER OVERLOAD: ${newStats.totalWattage}W / ${psu.specs.max_wattage}W`, severity: 'critical' });
    }

    set({ installedParts: newInstalledParts, systemStats: newStats, errors, selectedNode: null });
    return true;
  },

  removePart: (partId) => {
    const state = get();
    const newInstalledParts = state.installedParts.filter(p => p.id !== partId);
    const newStats = calculateSystemStats(newInstalledParts);
    set({ installedParts: newInstalledParts, systemStats: newStats, errors: [] });
  },

  selectNode: (node) => set({ selectedNode: node }),
  clearErrors: () => set({ errors: [] }),
  resetBuild: () => set({ installedParts: [], errors: [], selectedNode: null, systemStats: { totalCost: 0, totalWattage: 0, workstationScore: 0, gamingScore: 0, powerEfficiency: 100 } })
}));

function validateSlotCompatibility(part, node) {
  const slotMap = { 'cpu': ['CPU_SOCKET'], 'gpu': ['PCIE_X16'], 'ram': ['RAM_SLOT'], 'motherboard': ['MOTHERBOARD_MOUNT'], 'psu': ['PSU_MOUNT'] };
  const allowedSlots = slotMap[part.type];
  if (!allowedSlots) return true;
  return allowedSlots.includes(node.type);
}

function calculateSystemStats(installedParts) {
  let totalCost = 0; let totalWattage = 0; let workstationScore = 0; let gamingScore = 0;

  installedParts.forEach(part => {
    totalCost += part.price_estimate;
    totalWattage += part.specs.wattage || 0;
    const base = (part.specs.get ? part.specs.get('performance_score') : part.specs.performance_score) || 0;
    const wsWeight = (part.specs.get ? part.specs.get('workstation_weight') : part.specs.workstation_weight) || 0;
    const gWeight = (part.specs.get ? part.specs.get('gaming_weight') : part.specs.gaming_weight) || 0;
    workstationScore += base * wsWeight;
    gamingScore += base * gWeight;
  });

  const psu = installedParts.find(p => p.type === 'psu');
  let powerEfficiency = 100;
  if (psu && psu.specs.max_wattage > 0) {
    const utilization = (totalWattage / psu.specs.max_wattage) * 100;
    powerEfficiency = utilization > 100 ? 0 : utilization > 80 ? 100 - (utilization - 80) * 2 : 100;
  }
  return { totalCost: Math.round(totalCost), totalWattage: Math.round(totalWattage), workstationScore: Math.round(workstationScore), gamingScore: Math.round(gamingScore), powerEfficiency: Math.round(powerEfficiency) };
}

export default useBuilderStore;