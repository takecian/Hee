Counts = new Meteor.Collection("counts");
hee = "hee";
admin = "admin";
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
      return Counts.find({name: {$nin: [hee,admin]}});
  };

  Template.heeinput.events = {
    'click img' : function () {
	name = $('#name').val();
        if(name == "")
            {
                alert('名前を入力してください。');
                return;
            }
        if(name == admin)
	    {
		return;
	    }

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
    }
  };
    function TextChange(text){
	if($('#name').val() == admin)
	    {
		$('#resetall').css({"visibility":"visible"});
		$('#deleteall').css({"visibility":"visible"});
	    }
	else
	    {
		$('#resetall').css({"visibility":"hidden"});
		$('#deleteall').css({"visibility":"hidden"});
	    }
    }

  Template.heereset.events ={
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