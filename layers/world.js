addLayer("world", {
    name: "World", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "W", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            unlockOrder: 0,
            WorldstepHeight: new Decimal(10),//Do not use player.world.WorldstepHeight
            Worldtimer: new Decimal(0),
            StepgrowthSpeed: new Decimal(1),//per second
            fixednum: new Decimal(0),
            restrictionnum: new Decimal(0),
            currentStepType: 0,//not Decimal
            Worldrandomnum: 0,//not Decimal
            restrictChallenge: false,
            fixedspeedChallenge: false,
            randomChallenge: false,
        }
    },
    resource: "World Steps",
    color: "#ddeee3",
    nodeStyle() {
        return {
            background: (player.world.unlocked || canReset("world")) ? ("linear-gradient(#ededed, #383838)") : "#bf8f8f",
            //"background-size":"120px 120px",
            height: "96px",
            width: "96px",
            "border": "0px",
            "outline": "rgb(100,100,100) solid 4px",
        }
    },
    type: "none", // 怹也不通过重置获得点数,但是怹应该会被重置
    branches: ["mem"],

    row: 3, // Row the layer is in on the tree (0 is the first row)
    //displayRow: 2,
    layerShown() { return hasAchievement('a', 61) },
    unlocked() { return hasUpgrade('lab', 101) },

    doReset(resettingLayer) {
        let keep = [];
    },

    bars: {
        WorldProgressBar: {
            direction: RIGHT,
            width: 500,
            height: 25,
            progress() { return player.world.Worldtimer.div(tmp["world"].WorldstepHeight) },
            barcolor() {
                if (player.world.currentStepType < 75) return '#ddeee3';
                else if (player.world.currentStepType < 87) return '#bc24cb';
                else if (player.world.currentStepType < 99) return '#eec109';
                else return '#e8272a';
            },
            fillStyle() { return { 'background-color': layers.world.bars.WorldProgressBar.barcolor() } },
        },
    },

    WorldstepHeight() {
        let base = new Decimal(10);
        let step = base.times(player.world.points.plus(1));
        //if (hasAchievement('a', 93)) step = step.div(tmp.etoluna.moonPointeffect);
        //if (hasUpgrade('a', 163)) step = step.div(buyableEffect('lab', 43));
        //if (hasUpgrade('lethe', 73)) step = step.div(upgradeEffect('lethe', 73));
        //if (hasUpgrade('lethe', 84)) step = step.div(upgradeEffect('lethe', 84));
        if (step.gte(layers.world.WorldstepHeightsc())) step = Decimal.pow(step.sub(layers.world.WorldstepHeightsc()), layers.world.WorldstepHeightscexp()).plus(layers.world.WorldstepHeightsc());
        if (step.lt(10)) step = new Decimal(10);
        return step;
    },

    WorldstepHeightsc() {
        let sc = new Decimal(100000);
        //if (hasUpgrade('etoluna', 12)) sc = sc.times(tmp.etoluna.moonPointeffect);
        //if (hasMilestone('ins', 6)) sc = sc.times(layers.ins.insEffect().Zaf());
        //if (hasUpgrade('lethe', 82)) sc = sc.times(upgradeEffect('lethe',82));
        //if (hasUpgrade('lethe', 83)) sc = sc.times(upgradeEffect('lethe',83));
        //if (hasUpgrade('lethe', 93)) sc = sc.times(upgradeEffect('lethe',93));
        return sc;
    },

    WorldstepHeightscexp() {
        let exp = new Decimal(3);
        //if (hasUpgrade('story', 31)) exp = new Decimal(2);
        //if (hasUpgrade('lab', 162)) exp = exp.sub(upgradeEffect('lab', 162));
        return exp.max(1.5);
    },

    StepgrowthSpeed() {
        let speed = new Decimal(1);
        if (hasAchievement('a', 62)) speed = speed.times(2);
        if (hasChallenge('world', 12)) speed = speed.times(challengeEffect('world', 12));
        if (hasAchievement('a', 63)) speed = speed.times(achievementEffect('a', 63));
        if (hasMilestone('zero', 3)) speed = speed.times(player.zero.points.div(10).plus(1));
        if (hasMilestone('axium', 3)) speed = speed.times(player.axium.points.div(10).plus(1));
        if (hasMilestone('axium', 3)) speed = speed.times(buyableEffect('axium', 31));
        if (hasAchievement('a', 65)) speed = speed.times(1.5);


        if (player.world.currentStepType >= 99 && player.world.restrictChallenge) {
            if (!hasUpgrade('story', 11))
                return (player.points.plus(1).log10().div(2));
            else speed = player.points.plus(1).log10().div(1500);
        };
        //if (hasAchievement('a', 74)) speed = speed.times(achievementEffect('a', 74));
        //if (hasUpgrade('lab', 123)) speed = speed.times(upgradeEffect('lab', 123));
        //if (hasUpgrade('lab', 124)) speed = speed.times(upgradeEffect('lab', 124));
        //if (hasMilestone('saya', 7)) speed = speed.times(tmp.saya.effect);
        //if (hasUpgrade('etoluna', 11)) speed = speed.times(upgradeEffect('etoluna', 11));
        //if (hasUpgrade('lethe', 74)) speed = speed.times(upgradeEffect('lethe', 74));
        //if (hasUpgrade('lethe', 92)) speed = speed.times(upgradeEffect('lethe', 92));
        if (player.world.currentStepType < 87 && player.world.currentStepType >= 75) speed = speed.times(2);
        if (player.world.currentStepType < 99 && player.world.currentStepType >= 87) {
            if (hasUpgrade('story', 13)) speed = speed.times(0.75);
            else speed = speed.times(Math.min(1 - player.world.Worldrandomnum * 0.99, 0.75));
        }
        //if (hasUpgrade('world', 34) && speed.lt(upgradeEffect('world', 34))) speed = upgradeEffect('world', 34);
        return speed;
    },

    fixedReward() {
        let softcap = layers[this.layer].fixedsoftcap();
        let softcappower = layers[this.layer].fixedsoftcapexp();
        let reward = player.world.fixednum.div(2).plus(1);
        if (reward.gte(softcap)) reward = softcap.plus(Decimal.pow(reward.sub(softcap), softcappower));
        return reward;
    },

    fixedsoftcap() {
        let softcap = new Decimal(500);
        //if (hasUpgrade('etoluna', 13)) softcap = softcap.times(upgradeEffect('etoluna', 13));
        //if (player['tempest'].grid[203].activated) softcap = softcap.times(gridEffect('tempest',203))
        return softcap;
    },
    fixedsoftcapexp() {
        let softcappower = 0.25;
        //if (hasUpgrade('etoluna', 22)) softcappower *= tmp["etoluna"].moonPointeffect.toNumber();
        if (softcappower > 0.75) softcappower = 0.75;
        return softcappower;
    },

    restrictReward() {
        let softcap = layers[this.layer].restrictsoftcap();
        let hardcap = layers[this.layer].restricthardcap();
        let softcappower = layers[this.layer].restrictsoftcapexp();
        let reward = Decimal.pow(1.5, player.world.restrictionnum);
        if (reward.gte(softcap)) reward = softcap.plus(Decimal.pow(reward.sub(softcap), softcappower));
        //if (!hasUpgrade('story', 43))
        return reward.min(hardcap);
        //else {
        //    if (reward.gte(hardcap)) reward = reward.sub(hardcap).max(1).log(10).max(1).log(10).max(0).times(hardcap).plus(hardcap);
        //    return reward;
        //}
    },

    restrictsoftcap() {
        let softcap = new Decimal(20);
        if (hasAchievement('a', 83)) softcap = new Decimal(25);
        return softcap;
    },

    restrictsoftcapexp() {
        let softcappower = 0.25;
        return softcappower;
    },

    restricthardcap() {
        let hardcap = new Decimal(150)
        //if (hasUpgrade('etoluna', 14)) hardcap = hardcap.times(tmp["etoluna"].moonPointeffect);
        //if (hasUpgrade('etoluna', 21)) hardcap = hardcap.times(upgradeEffect('etoluna', 21));
        //if (hasUpgrade('lab', 193)) hardcap = hardcap.times(upgradeEffect('lab', 193));
        return hardcap;
    },

    update(diff) {//重头戏
        if (!player.world.unlocked) player.world.Worldtimer = new Decimal(0);
        player.world.Worldtimer = player.world.Worldtimer.plus(tmp["world"].StepgrowthSpeed.times(diff));
        if (player.world.Worldtimer.gte(tmp["world"].WorldstepHeight)) {

            if (player.world.currentStepType < 99 && player.world.currentStepType >= 87) player.world.fixednum = player.world.fixednum.plus(1);//(Decimal.times(1, upgradeEffect('story', 24)).times(hasMilestone('etoluna', 6) ? (player.world.Worldtimer.div(tmp["world"].WorldstepHeight).max(1).min(player[this.layer].points)) : 1));
            if (player.world.currentStepType >= 99) player.world.restrictionnum = player.world.restrictionnum.plus(1);//(Decimal.times(1, upgradeEffect('story', 24)).times(hasMilestone('etoluna', 6) ? (player.world.Worldtimer.div(tmp["world"].WorldstepHeight).max(1).min(player[this.layer].points)) : 1));
            player[this.layer].points = player[this.layer].points.plus(Decimal.times(1, 1).times(1));
            player.world.Worldtimer = new Decimal(0);
            player.world.Worldrandomnum = Math.random();
        };

        if (player[this.layer].points.gte(player[this.layer].best)) player[this.layer].best = player[this.layer].points;
    },

    tabFormat: {
        Upgrades: {
            content: [
                "blank",
                "main-display",
                "blank",
                "resource-display",
                "blank",
                ["bar", "WorldProgressBar"],
                ["display-text", function () { return formatWhole(player.world.Worldtimer) + " / " + formatWhole(tmp["world"].WorldstepHeight) + " Step Height" }, {}],
                ["display-text", function () { if (tmp["world"].WorldstepHeight.gte(layers.world.WorldstepHeightsc())) return "You have reached World Step Height softcap and exceeding height ^" + format(layers.world.WorldstepHeightscexp()) }, {}],
                ["display-text", function () { return "Push the World Steps to unlock challenges.<br>" + ( hasChallenge('world', 12) && player.world.points.gte(100) ? "You've unlocked all World Maps for now." : ( hasChallenge('world', 12) ? "Next challenge unlocks at 100 World Steps." : ( hasChallenge('world', 11) ? "Next challenge unlocks at 10 World Steps." : "Next challenge unlocks at 5 World Steps."))) }, {}],
                ["display-text",
                    function () {
                        if (player.world.currentStepType < 75) return "";
                        if (player.world.currentStepType < 87 && player.world.currentStepType >= 75) return ("You are going through random World Step. Current speed: 2x");
                        if (player.world.currentStepType < 99 && player.world.currentStepType >= 87) return ("You are going through fixed World Step. Current speed: " + format(hasUpgrade('story', 13) ? 0.75 :(Math.min(1 - player.world.Worldrandomnum * 0.99, 0.75))) + "x")
                        if (player.world.currentStepType >= 99) {
                            if (!player.world.restrictChallenge) return "You need to Enduring a small Challenge to go through restricted World Step."
                            else return ("You are going through restricted World Step.<br>Your Fragments generation & Memories gain ^0.9 & The Speed of World Steps gain is determined by your Fragments.")
                        };
                    }
                    , {}],
                "blank",
                "challenges",
                "blank",
                "clickables"
            ]
        },
        Atlas: {
            unlocked() { return hasAchievement('a', 71) },
            content: [
                "blank",
                "main-display",
                "blank",
                "resource-display",
                "blank",
                ["bar", "WorldProgressBar"],
                ["display-text", function () { return formatWhole(player.world.Worldtimer) + " / " + formatWhole(tmp["world"].WorldstepHeight) + " Step Height" }, {}],
                "blank",
                ["row", [
                    ["column", [
                        ["display-text", function () { return "You have gone through <h3 style='color: #eec109;'>" + formatWhole(player.world.fixednum) + "</h3> fixed World Steps." }, {}],
                        "blank",
                        ["display-text", function () { return "Which boosts Luminous Churches&Flourish Labyrinths gain by <h3 style='color: #eec109;'>" + format(layers.world.fixedReward()) + "</h3>x" }, {}],
                        "blank",
                    ], { width: "50%" }],
                    ["column", [
                        ["display-text", function () { return "You have gone through <h3 style='color: #e8272a;'>" + formatWhole(player.world.restrictionnum) + "</h3> restricted World Steps." }, {}],
                        "blank",
                        ["display-text", function () { return "Which boosts Research Points gain by <h3 style='color: #e8272a;'>" + format(layers.world.restrictReward()) + "</h3>x" }, {}],
                        "blank",
                    ], { width: "50%" }],]
                    , {}],
            ],
        },
    },
    
    challenges: {
        11: {
            name: "Forbidden Area",
            challengeDescription: "Memories boost Research Power gain, but you are losing 0.5% Memories per second, regardless of other upgrades.",
            goalDescription: "1e12 Research Power",
            canComplete() {
                return player.lab.power.gte(1e12)
            },
            rewardDescription: "Memories and World Steps boost Research Power gain.<br>And unlock World Researches in the lab layer.",
            rewardEffect() {
                let effm = player.mem.points.plus(1).log10().log10().times(2).max(1);
                let effw = player.world.points.div(10).plus(1);
                let eff = effw.times(effm);
                return eff;
            },
            onExit() {
                doReset("zero", true);
                player.points = new Decimal(1);
                player.mem.points = new Decimal(1);
                player.light.points = new Decimal(0);
                player.dark.points = new Decimal(0);
                player.kou.points = new Decimal(0);
                player.lethe.points = new Decimal(0);
                player.kou.buyables[11] = new Decimal(0);
            },
            unlocked() { return player.world.points.gte(5) || hasChallenge('world', 11) }
        },
        12: {
            name: "Beyond Unknowns",
            challengeDescription: "The Tower's effect is massively decreased, but with L & D direct gain x10 and much cheaper Tower price.",
            goalDescription: "1e180 Memories",
            canComplete() {
                return player.mem.points.gte(1e180)
            },
            rewardDescription: "L & D direct gain x5 and they boosts World Steps gain.<br>And the Tower now boosts LC & FL's gain.",
            rewardEffect() {
                let eff = player.light.points.plus(player.dark.points);
                eff = eff.log10().div(10).plus(1);
                return eff.max(1);
            },
            onEnter() {
                doReset("lethe", true);
                player.points = new Decimal(1);
                player.mem.points = new Decimal(1);
                player.light.points = new Decimal(0);
                player.dark.points = new Decimal(0);
                player.kou.points = new Decimal(0);
                player.lethe.points = new Decimal(0);
                player.kou.buyables[11] = new Decimal(0);
            },
            onExit() {
                doReset("zero", true);
                player.points = new Decimal(1);
                player.mem.points = new Decimal(1);
                player.light.points = new Decimal(0);
                player.dark.points = new Decimal(0);
                player.kou.points = new Decimal(0);
                player.lethe.points = new Decimal(0);
                player.kou.buyables[11] = new Decimal(0);
            },
            unlocked() { return player.world.points.gte(10) && hasChallenge('world', 11) || hasChallenge('world', 12) }
        },
        21: {
            name: "Collapsed Crucifix",
            challengeDescription: "You can have 9 Beacons at most, but your times moved North will boost your Red Dolls' and Forgotten Drops' gain.",
            goalDescription: "98 Red Dolls & 1e165 Forgotten Drops",
            canComplete() {
                return player.kou.points.gte(98) && player.lethe.points.gte(1e165)
            },
            rewardDescription: "World Steps boost LC, FL and GR gain.<br>And you get extra moves in the maze based on your best World Steps.",
            rewardEffect() {
                return player[this.layer].points.div(10).max(1);
            },
            onEnter() {
                doReset("lethe", true);
                player.lethe.upgrades = [];
                player.points = new Decimal(1);
                player.mem.points = new Decimal(1);
                player.light.points = new Decimal(0);
                player.dark.points = new Decimal(0);
                player.kou.points = new Decimal(0);
                player.lethe.points = new Decimal(0);
                player.kou.buyables[11] = new Decimal(0);
            },
            onExit() {
                doReset("zero", true);
                player.points = new Decimal(1);
                player.mem.points = new Decimal(1);
                player.light.points = new Decimal(0);
                player.dark.points = new Decimal(0);
                player.kou.points = new Decimal(0);
                player.lethe.points = new Decimal(0);
                player.kou.buyables[11] = new Decimal(0);
            },
            unlocked() { return player.world.points.gte(100) && hasChallenge('world', 12) || hasChallenge('world', 21) }
        },
    },

    clickables: {
        //rows: 1,
        //cols: 1,
        11: {
            title: "Go onto Restriction Steps",
            display() {
                return "These Steps will slow down your world step based on your Fragments, but these steps you pass through will boost your Research Points gain.<br><br>Currently:" + (player.world.restrictChallenge ? "In" : "Out")
            },
            unlocked() { return hasAchievement('a', 71) },
            canClick() { return hasAchievement('a', 71) },
            onClick() {
                player.world.Worldtimer = new Decimal(0);
                if (!player.world.restrictChallenge) player.world.currentStepType = 99;
                else player.world.currentStepType = 50;
                if (player.world.restrictChallenge) player.world.Worldtimer = new Decimal(0);
                if (!player.world.restrictChallenge) {
                    player.points = new Decimal(0);
                    doReset('mem', true);
                    doReset('light', true);
                    doReset('dark', true);
                };
                player.world.restrictChallenge = !player.world.restrictChallenge;
                player.world.fixedspeedChallenge = false;
                player.world.randomChallenge = false;
            },
            style: { width: "150px", height: "150px", "background-color"() { return player.world.restrictChallenge ? "#e8272a" : "#666666" } },
        },
        12: {
            title: "Go onto Fixed Speed Steps",
            display() {
                return "These Steps will slow down your world step gain (0~0.75), but these steps you pass through will boost your LC & FL gain.<br><br>Currently:" + (player.world.fixedspeedChallenge ? "In" : "Out")
            },
            unlocked() { return hasAchievement('a', 71) },
            canClick() { return hasAchievement('a', 71) },
            onClick() {
                player.world.Worldrandomnum = Math.random();
                player.world.Worldtimer = new Decimal(0);
                if (!player.world.fixedspeedChallenge) player.world.currentStepType = 87;
                else player.world.currentStepType = 50;
                if (player.world.fixedspeedChallenge) player.world.Worldtimer = new Decimal(0);
                if (!player.world.fixedspeedChallenge) {
                    player.points = new Decimal(0);
                    doReset('mem', true);
                    doReset('light', true);
                    doReset('dark', true);
                };
                player.world.fixedspeedChallenge = !player.world.fixedspeedChallenge;
                player.world.restrictChallenge = false;
                player.world.randomChallenge = false;
            },
            style: { width: "150px", height: "150px", "background-color"() { return player.world.fixedspeedChallenge ? "#eec109" : "#666666" } },
        },
        13: {
            title: "Go onto Random Steps",
            display() {
                return "These Steps will randomize L, D, R, F's effects by ticks (^0~^1), but also double the speed of World Steps gain.<br><br>Currently:" + (player.world.randomChallenge ? "In" : "Out")
            },
            unlocked() { return hasAchievement('a', 71) },
            canClick() { return hasAchievement('a', 71) },
            onClick() {
                player.world.Worldtimer = new Decimal(0);
                if (!player.world.randomChallenge) player.world.currentStepType = 75;
                else player.world.currentStepType = 50;
                if (player.world.randomChallenge) player.world.Worldtimer = new Decimal(0);
                if (!player.world.randomChallenge) {
                    player.points = new Decimal(0);
                    doReset('mem', true);
                    doReset('light', true);
                    doReset('dark', true);
                };
                player.world.randomChallenge = !player.world.randomChallenge;
                player.world.restrictChallenge = false;
                player.world.fixedspeedChallenge = false;

            },
            style: { width: "150px", height: "150px", "background-color"() { return player.world.randomChallenge ? "#bc24cb " : "#666666" } },
        },
        21: {
            title: "Fall Down",
            display: "Lose 20% of your World Steps.",
            unlocked() { return player.world.points.gte(10) },
            canClick() { return player.world.points.gte(10) },
            onClick() {
                if (!confirm("This button is designed to go through restriction & fixed speed World Step quickly, but it can cost much! Are you sure?")) return;
                player.world.points = player.world.points.times(0.8).floor();
            },
        },
    },

})