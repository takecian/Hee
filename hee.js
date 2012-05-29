Counts = new Meteor.Collection("counts");
hee = "hee";
sound = "hee.mp3";

if (Meteor.is_client) {
    var name;
    var audio = new Audio(sound);
    audio.load();

  Template.hee.score = function () {
      var info = Counts.findOne({name: hee});
      return info && info.score;
  };

  Template.scoreboard.heescore = function (){
      return Counts.find({name: {$ne: hee}});
  };

  Template.heeinput.events = {
    'click img' : function () {
	name = $('#name').val();
	var info = Counts.findOne({name: name});
	if(info)   
	    {
		if(info.score < 20)
		    {
		Counts.update({name: name}, {$inc: {score: 1}});
		    }
		else
		    {
			return;
		    }
	    }
	else
	    {
		Counts.insert({name: name, score: 1});
	    }

        Counts.update({name: hee}, {$inc: {score: 1}});
        audio.play();
	audio = new Audio(sound);
	audio.load();
    },
      'click #resetall' : function (){
	  Counts.update({}, {$set: {score: 0}}, {multi: true});
      },
      'click #deleteall' : function (){
	  Counts.remove({});
	  Counts.insert({name: hee, score: 0});
      }
  };
}

if (Meteor.is_server) {
  Meteor.startup(function () {
          if(Counts.find().count() === 0)
              {
                  Counts.insert({name: hee, score: 0});
              }
  });
}