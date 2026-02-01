const mongoose = require('mongoose');

// ============================================
// SUB-SCHEMAS (smaller pieces used in the main schema)
// ============================================

// What a weapon looks like
const weaponSchema = new mongoose.Schema({
  name: { type: String, required: true },        // "M3 75mm gun"
  range: {
    inches: { type: Number, required: true },    // 24
    cm: { type: Number, required: true }         // 60
  },
  rof: {
    halted: { type: Number, required: true },    // 2
    moving: { type: Number, required: true }     // 1
  },
  antiTank: { type: Number, required: true },    // 9
  firePower: { type: String, required: true },   // "3+"
  notes: [{ type: String }]                      // ["HEAT", "SMOKE"]
}, { _id: false });  // Don't create separate IDs for weapons

// Special rule that modifies a stat
const specialRuleModifierSchema = new mongoose.Schema({
  name: { type: String, required: true },    // "Open Top"
  stat: { type: String, required: true },    // "Counterattack"
  value: { type: String, required: true }    // "6"
}, { _id: false });

// Distance measurement
const distanceSchema = new mongoose.Schema({
  inches: { type: Number, required: true },
  cm: { type: Number, required: true }
}, { _id: false });

// ============================================
// MAIN UNIT SCHEMA
// ============================================

const unitSchema = new mongoose.Schema({
  // === IDENTIFICATION ===
  unitId: { 
    type: String, 
    required: true, 
    unique: true,      // No two units can have same ID
    index: true        // Makes searching faster
  },
  name: { type: String, required: true },      // "M3 75MM GMC"
  subtitle: { type: String },                   // "Tank Destroyer Platoon"
  
  // === CLASSIFICATION ===
  nation: { 
    type: String, 
    required: true,
    enum: ['USA', 'JAPAN', 'BRITAIN', 'AUSTRALIA', 'USMC']  // Only these values allowed
  },
  unitType: { 
    type: String, 
    required: true,
    enum: ['TANK', 'INFANTRY', 'GUN', 'AIRCRAFT']
  },
  unitCategory: {
    type: String,
    enum: ['HQ', 'COMBAT', 'WEAPONS', 'SUPPORT'],
    default: 'COMBAT'
  },
  specialRules: [{ type: String }],  // ["SEEK, STRIKE, AND DESTROY"]
  
  // === RATINGS ===
  motivation: {
    rating: { 
      type: String, 
      required: true,
      enum: ['FEARLESS', 'CONFIDENT', 'RELUCTANT']
    },
    value: { type: String, required: true },  // "4+"
    specialRules: [specialRuleModifierSchema]
  },
  
  skill: {
    rating: { 
      type: String, 
      required: true,
      enum: ['VETERAN', 'TRAINED', 'GREEN']
    },
    value: { type: String, required: true },
    specialRules: [specialRuleModifierSchema]
  },
  
  hitOn: {
    rating: { 
      type: String, 
      required: true,
      enum: ['CAREFUL', 'CAUTIOUS', 'AGGRESSIVE']
    },
    value: { type: String, required: true }
  },
  
  // === ARMOUR (for TANK units) ===
  armour: {
    front: { type: Number },
    sideRear: { type: Number },
    top: { type: Number }
  },
  
  // === SAVE (for INFANTRY units) ===
  save: { type: String },  // "4+"
  
  // === MOVEMENT (for vehicles) ===
  movement: {
    tactical: distanceSchema,
    terrainDash: distanceSchema,
    crossCountryDash: distanceSchema,
    roadDash: distanceSchema,
    cross: { type: String, required: true }  // "4+"
  },
  
  // === INFANTRY MOVEMENT ===
  infantryMovement: {
    tactical: distanceSchema,
    dash: distanceSchema,
    crossCountryDash: distanceSchema,
    cross: { type: String }
  },
  
  // === WEAPONS ===
  weapons: [weaponSchema],
  
  // === TEAMS (for infantry) ===
  teams: [{
    name: { type: String },     // "Rifle team"
    count: { type: Number }     // 7
  }],
  
  // === POINTS COST ===
  // Map of unit count to points: { "2": 4, "3": 6, "4": 8 }
  pointsCost: {
    type: Map,
    of: Number
  }
  
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});

// Export the model so other files can use it
module.exports = mongoose.model('Unit', unitSchema);