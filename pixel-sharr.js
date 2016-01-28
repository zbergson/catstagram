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
      $('.pictures').show();
      
      // when user clicks profile button, filter pictures so user only sees their photos
      for (i = 0; i < pictures.length; i++ ) {
        var picturesLoop = pictures[i]
        
        var changePictures = $('.pictures')[i];
        if ($(picturesLoop).attr('data-id') !== Meteor.userId()) {
          $(changePictures).hide();
          
        }

      }
    },
    "click .home": function() {
      //when user clicks home button, remove profile filter so user can see all photos
      $('.pictures').show();
      $('header').css("background-image", "none");
    },
    "click #logo": function() {
      //when user clicks logo, remove profile filter so user can see all photos
      $('.pictures').show();
      $('header').css("background-image", "none");
    },
    "click .username": function() {
      //when user clicks any users username, bring them to that users profile page by filtering pictures
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
    //delete a picture, only if that picture is owned by current signed in user
    "click .delete": function () {
      if (this.owner === Meteor.userId()) {
        Meteor.call("deletePic", this._id);
      }
      
    },
    "click .like-button": function() {
      //call backend function that will increase likes on a post
      Meteor.call("clickLike", this._id);
    }

  });


  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

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
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Pics.update(picId, {
      $inc: {likes: +1}
    });
  }
});
