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
            name: "Eternal Core",
            done() { return false },
            tooltip: "Build up the Core.<br>Rewards:Keep the Core on all resets.",
            unlocked() { return true },
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