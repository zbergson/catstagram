Pics = new Mongo.Collection("pics");


if (Meteor.isClient) {
  Template.body.helpers({
    pics: function () {
      return Pics.find({}, {sort: {createdAt: -1}});
    }
   
  });

  Template.body.events({
    "click #submit": function(event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var content = $('.content').val();
      var image = $('.image').val();
      var likes = 0;
      
      
 
      // Insert an image into the collection
      Meteor.call("addPic", image, content, likes);
 
      // Clear form
      $('.content').val('');
      $('.image').val('');
    },
    "click .userpage": function() {
      var pictures = $('.pictures');
      
      
      for (i = 0; i < pictures.length; i++ ) {
        var picturesLoop = pictures[i]
        
        var changePictures = $('.pictures')[i];
        if ($(picturesLoop).attr('data-id') !== Meteor.userId()) {
          $(changePictures).hide();
          $('header').css("background-image", "url(http://videos.revision3.com/revision3/images/shows/lilbub/0052/lilbub--0052--the-return-of-bubs-real-brother-the-spooky-saga--marge.thumb.jpg)")
        }

      }
    },
    "click .home": function() {
      console.log('hi');
      $('.pictures').show();
      $('header').css("background-image", "none");
    },
    "click .username": function() {
      var pictures = $('.pictures');
      var currentOwner = this.owner;
      

      for (i = 0; i < pictures.length; i++) {
        var picturesLoop = pictures[i];
        var changePictures = $('.pictures')[i];

        if($(picturesLoop).attr('data-id') !== currentOwner) {
          $(changePictures).hide();
        }

      }
    }
    

  });





  Template.pic.events({
    "click .delete": function () {
      if (this.owner === Meteor.userId()) {
        Meteor.call("deletePic", this._id);
      }
      
    },
    "click .like-button": function() {
      Meteor.call("clickLike", this._id);
    }

  });



  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  // Template.user.helpers({
  //   user: function(){
  //     var currentUserId = Meteor.userId();
  //     return Pics.find({owner: currentUserId });
  //   }
  // })
}





Meteor.methods({
  addPic: function (image, content, likes) {
    // Make sure the user is logged in before inserting image
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
 
    Pics.insert({
      image: image,
      content: content,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
      likes: likes
    });
  },
  deletePic: function (picId) {
    Pics.remove(picId);
  },
  clickLike: function(picId) {
    Pics.update(picId, {
      $inc: {likes: +1}
    });
  }
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
