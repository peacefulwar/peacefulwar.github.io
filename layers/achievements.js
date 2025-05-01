addLayer("a", {
    startData() {
        return {
            unlocked: true,
        }
    },
    color: "yellow",
    row: "side",
    layerShown() { return true },
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    achievements: {
        11: {
            name: "An Essence of the Broken World",
            done() { return player.mem.points.gte(100) },
            tooltip: "Gain 100 Memories.<br>Rewards:Fragments generation is a little faster.",
            unlocked() { return true },
        },
        12: {
            name: "A Stack",
            done() { return player.points.gte(9999) },
            tooltip: "Gain 9999 Fragments.",
            unlocked() { return true },
        },
        13: {
            name: "A Step to the Unknown",
            done() { return hasUpgrade('mem', 24) },
            tooltip: "Start exploring the world.",
            unlocked() { return true },
        },
        14: {
            name: "Get Ready",
            done() { return player.mem.points.gte(9999) },
            tooltip: "Gain 9999 Memories.<br>Rewards:You start at 5 Memories when reset.",
            unlocked() { return true },
        },
        15: {
            name: "Define Aspects",
            done() { return player.light.unlocked && player.dark.unlocked },
            tooltip: "Unlock Both Light And Dark Layers.<br>Rewards:They behave as they are unlocked first and there's a new row of Mmeory upgrade.",
        },
        21: {
            name: "Define Aspects™",
            done() { return hasMilestone('light', 0) && hasMilestone('dark', 0) },
            tooltip: "Reach L&D's 1st milestone.",
            unlocked() { return true },
        },
        22: {
            name: "No longer useless",
            done() { return hasUpgrade('dark', 33) },
            tooltip: "Make your Achievements useful for something.",
            unlocked() { return true },
        },
        23: {
            name: "Stacks^Stacks",
            done() { return player.points.gte(999e16) },
            tooltip: "Gain 9.99e18 Fragments.<br>Rewards:Fragments now make Memory softcap starts later.",
            unlocked() { return true },
        },
        24: {
            name: "Eternal Core",
            done() { return hasUpgrade('mem', 41) },
            tooltip: "Build up the Core.<br>Rewards:Keep the Core on all resets and add one milestone each for L&D.",
            unlocked() { return true },
        },
        25: {
            name: "Core-Automating",
            done() { return (hasMilestone('light', 3) || hasMilestone('dark', 3)) && hasUpgrade('mem', 41) },
            tooltip: "Start generating your Memories after you have the core.<br>Rewards:L&D's upgrades will give back half of their cost.",
            unlocked() { return true },
        },
        31: {
            name: "New Branches",
            done() { return player.kou.unlocked && player.lethe.unlocked },
            tooltip: "Unlock both Red and Forgotten layers.<br>Rewards:They behave as they are unlocked first.",
            unlocked() { return true },
        },
        32: {
            name: "Plenty of them",
            done() { return player.light.points.plus(player.dark.points).gte(380) },
            tooltip: "Have more than 380 Light Tachyons or Dark Matters.<br>Rewards:Their effects increase based on their own reset time.",
            unlocked() { return true },
        },
        33: {
            name: "Higher than the Clouds!",
            done() { return player.kou.buyables[11].gte(10) },
            tooltip: "Make the Tower have at least 10 levels.",
            unlocked() { return true },
        },
        34: {
            name: "Plenty*3.95 of them",
            done() { return player.light.points.plus(player.dark.points).gte(1500) },
            tooltip: "Have more than 1500 Light Tachyons or Dark Matters.<br>Rewards:L's effect boosts R's gain, D's effect boosts F's gain.",
            unlocked() { return true },
        },
        35: {
            name: "Scepter of The Soul Guide",
            done() { return hasUpgrade("lethe", 33) },
            tooltip: "Buy your first Guiding Beacon.<br>Rewards: Always gain 30% of Memory gain every second.",
            unlocked() { return true },
        },
        41: {
            name: "e(An Essence) of the Broken World",
            done() { return player.mem.points.gte(1e100) },
            tooltip: "Gain 1e100 Memories.<br>Rewards:Starts at 100 Memories when reset.",
        },
        42: {
            name: "Stacks e(Stacks)",
            done() { return player.points.gte(9.99e99) },
            tooltip: "Gain 9.99e99 Fragments.",
        },
        43: {
            name: "Preparation has been made.",
            done() { return hasUpgrade("kou", 16) },
            tooltip: "Buy all Tower upgrades.<br>Rewards: You can buy 4 more Beacons.",
            unlocked() { return true },
        },
        44: {
            name: "Beacons Beside Lethe",
            done() { return player.lethe.upgrades.length >= 25 },
            tooltip: "Have 25 Guiding Beacons.",
        },

    },
    tabFormat: [
        "blank",
        ["display-text", function () { return "When boosts say sth about achievements, usually it relates to the amount of achievements you have." }],
        ["display-text", function () { return "Achievements: " + player.a.achievements.length + "/" + (Object.keys(tmp.a.achievements).length - 2) }],
        ["display-text", function () { return "Currently, softcap power is: " + format(tmp["mem"].softcapPower) }],
        ["display-text", function () { return "Currently, softcap is: " + format(tmp["mem"].softcap) }],
        "blank", "blank",
        "achievements",
    ],
},
) 