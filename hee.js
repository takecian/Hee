Counts = new Meteor.Collection("counts");
hee = "hee";
admin = "admin";
sound = "hee.mp3";

if (Meteor.is_client) {
    var name;
    var audio = new Audio(sound);
    audio.load();

    Meteor.autorun(function() {
        Meteor.subscribe('count');
    });

    Template.hee.score = function() {
        var info = Counts.findOne({
            name: hee
        });
        return info && info.score;
    };

    Template.scoreboard.heescore = function() {
        return Counts.find({
            name: {
                $nin: [hee, admin]
            }
        });
    };

    Template.heeinput.events = {
        'click img': function() {
            inputedName = $('#name').val();
            if (inputedName === "") {
                alert('名前を入力してください。');
                return;
            }
            if ($('#name').val() == admin) {
                $('#resetall').css({
                    "visibility": "visible"
                });
                $('#deleteall').css({
                    "visibility": "visible"
                });
            } else {
                $('#resetall').css({
                    "visibility": "hidden"
                });
                $('#deleteall').css({
                    "visibility": "hidden"
                });
            }
            if (inputedName == admin) {
                return;
            }

            var info = Counts.findOne({
                name: inputedName
            });

            if (info) {
                if (info.score < 20) {
                    Counts.update({
                        _id: Counts.findOne({
                            name: inputedName
                        })._id
                    }, {
                        $inc: {
                            score: 1
                        }
                    });
                } else {
                    return;
                }
            } else {
                Counts.insert({
                    name: inputedName,
                    score: 1
                });
            }

            Counts.update({
                _id: Counts.findOne({
                    name: hee
                })._id
            }, {
                $inc: {
                    score: 1
                }
            });
            audio.play();
            audio = new Audio(sound);
            audio.load();
        }
    };

    Template.heereset.events = {
        'click #resetall': function() {
            Meteor.call('reset');
        },
        'click #deleteall': function() {
            Meteor.call('resetall');
        }
    };
}

if (Meteor.is_server) {
    Meteor.publish("count", function() {
        return Counts.find(); // everything
    });

    Meteor.methods({
        reset: function() {
            Counts.update({}, {
                $set: {
                    score: 0
                }
            }, {
                multi: true
            });
        },
        resetall: function() {
            Counts.remove({});
            Counts.insert({
                name: hee,
                score: 0
            });

        }
    });

    Counts.allow({
        // データの挿入を許可するか
        insert: function(name, score) {
            return true;
        },
        // データの更新を許可するか
        update: function(name, score) {
            return true;

        },
        // データの削除を許可するか
        remove: function(name, score) {
            return true;
        },
        fetch: undefined
    });

    Meteor.startup(function() {
        if (Counts.find().count() === 0) {
            Counts.insert({
                name: hee,
                score: 0
            });
        }
    });
}