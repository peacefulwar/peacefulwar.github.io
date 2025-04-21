addLayer("mem", {
    name: "memory", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#c939db",
    requires: new Decimal(15), // Can be a function that takes requirement increases into account
    resource: "Memories", // Name of prestige currency
    baseResource: "Fragments", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.45, // Prestige currency exponent
    softcap() {
        let sc = new Decimal("1e10");
        if (hasMilestone('dark', 1)) sc = sc.times(tmp.dark.effect)
        if (hasUpgrade('dark', 21)) sc = sc.times(50)
        if (hasUpgrade('dark', 32)) sc = sc.times(upgradeEffect('dark', 32));
        return sc;
    },
    softcapPower() {
        let scp = 0.25
        if (hasUpgrade('light', 21)) scp = 0.33
        if (hasUpgrade('light', 32)) scp = 0.40
        if (hasMilestone('light', 1)) scp = scp + 0.02
        return scp
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('mem', 12)) mult = mult.times(upgradeEffect('mem', 12))
        if (player.dark.unlocked) mult = mult.times(tmp.dark.effect);
        if (hasUpgrade('light', 11) && !canReset('light')) mult = mult.times(3)
        if (hasUpgrade('light', 12)) mult = mult.times(upgradeEffect('light', 12));
        if (hasUpgrade('mem', 31)) mult = mult.times(upgradeEffect('mem', 31));

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        if (hasUpgrade('mem', 13)) exp = exp.times(upgradeEffect('mem', 13));
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "m", description: "M: Reset for memories", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    passiveGeneration() {
        let pg = 0;
        if (hasMilestone('light', 3)) pg = pg + 0.05;
        if (hasMilestone('dark', 3)) pg = pg + 0.05;
        //if (hasUpgrade('lethe', 33)) pg = pg + 0.2;
        return pg;
    },
    doReset(resettingLayer) {
        let keep = [];
        if (layers[resettingLayer].row > this.row) {
            layerDataReset("mem", keep);
            if (hasAchievement("a", 14)) player[this.layer].upgrades = player[this.layer].upgrades.concat([24]);
            if (hasMilestone('light', 0)) player[this.layer].upgrades = player[this.layer].upgrades.concat([11, 12, 13, 14]);
            if (hasMilestone('dark', 0)) player[this.layer].upgrades = player[this.layer].upgrades.concat([21, 22, 23]);
            if (hasMilestone('dark', 2)) player[this.layer].upgrades = player[this.layer].upgrades.concat([31, 32]);
            if (hasMilestone('light', 2)) player[this.layer].upgrades = player[this.layer].upgrades.concat([33, 34]);
            if (hasAchievement("a", 13) && (resettingLayer != 'mem')) player[this.layer].points = new Decimal(5);
        }
    },
    upgrades: {
        11: {
            title: "Beginning of the Creation",
            description: "Speed up collecting fragments.",
            cost() { return new Decimal(1) },
            effect() {
                let eff = new Decimal(1.5);
                if (hasUpgrade('mem', 21)) eff = eff.pow(upgradeEffect('mem', 21));
                return eff;
            },
        },
        12: {
            title: "Memory Extraction",
            description: "Memory gain is boosted by Memories.",
            cost() { return new Decimal(3) },
            unlocked() { return hasUpgrade("mem", 11) },
            effect() {
                let eff = player[this.layer].points.plus(1).pow(0.25);
                if (hasUpgrade('mem', 33)) eff = eff.pow(1.25);
                return eff;
            },
        },
        13: {
            title: "Algorithm Managing",
            description: "Lower further Memory's Fragment requirement.",
            cost() { return new Decimal(10) },
            unlocked() { return hasUpgrade("mem", 12) },
            effect() {
                let eff = new Decimal(1.25);
                if (hasUpgrade('mem', 23)) eff = eff.pow(upgradeEffect('mem', 23));
                return eff;
            },
        },
        14: {
            title: "Fragment Duplication",
            description: "Fragment generation is boosted by Fragments.",
            cost() { return new Decimal(20) },
            unlocked() { return hasUpgrade("mem", 13) },
            effect() {
                return player.points.plus(1).log10().pow(0.75).plus(1).max(1);
            },
        },
        21: {
            title: "Thought Combination",
            description: "Beginning of the Creation is much faster.",
            cost() { return new Decimal(30) },
            unlocked() { return hasUpgrade("mem", 14) || hasMilestone("dark", 0)},
            effect() {
                let eff = new Decimal(2);
                if (hasUpgrade('mem', 32)) eff = eff.pow(upgradeEffect('mem', 32));
                return eff
            },
        },
        22: {
            title: "Fragment Prediction",
            description: "Fragment generation is boosted by Memories.",
            cost() { return new Decimal(50) },
            unlocked() { return hasUpgrade("mem", 21) },
            effect() {
                return player[this.layer].points.plus(1).pow(0.5).max(1)
            },
        },
        23: {
            title: "Time Boosting",
            description: "Algorithm Managing is effected by Fragments.",
            cost() { return new Decimal(100) },
            unlocked() { return hasUpgrade("mem", 22) },
            effect() {
                return player.points.plus(1).times(1.5).log10().max(1).log10(2).pow(0.01).plus(1).max(1);
            },
        },
        24: {
            title: "A New Story",
            description: "Unlock two new layers.",
            cost() { return new Decimal(1000) },
            unlocked() { return hasUpgrade("mem", 23) || hasAchievement("a", 14)},
        },
        31: {
            title: "Directly Drown",
            description: "Memories gain is boosted by Fragments.",
            cost() { return new Decimal(1e11) },
            unlocked() { return hasUpgrade("mem", 23) && hasAchievement("a", 15) },
            effect() {
                return player.points.plus(1).pow(0.05).plus(1).log10().plus(2).log10(5).plus(1).max(1);
            },
        },
        32: {
            title: "Thought Growth",
            description: "Thought Combination is boosted by Memories.",
            cost() { return new Decimal(1e12) },
            unlocked() { return hasUpgrade("mem", 31) },
            effect() {
                return player[this.layer].points.plus(1).log10().pow(0.5).log10(2).max(1);
            },
        },
        33: {
            title: "Memory Inflation",
            description: "Memory Extraction is much faster.",
            cost() { return new Decimal(5e12) },
            unlocked() { return hasUpgrade("mem", 32) },
        },
        34: {
            title: "The Thread of Two Sides",
            description() {
                return "Light Talcyons and Dark Matters boost each other's gain slightly based on their average.<br>Currently: " + format(upgradeEffect('mem', 34)) + "x";
            },
            cost() { return new Decimal(1e13) },
            unlocked() { return hasUpgrade("mem", 33) },
            effect() {
                let eff = player.light.points.plus(player.dark.points).plus(2).div(2).log10().max(1)
                if (hasUpgrade('light', 33)) eff = player.light.points.plus(player.dark.points).plus(2).div(2).sqrt().max(1)
                if (hasUpgrade('light', 23)) eff = eff.times(upgradeEffect('light', 23))
                if (hasUpgrade('dark', 23)) eff = eff.times(upgradeEffect('dark', 23))
                return eff
            }
        },
    },
})