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
      
      
 
      // Insert an image into the collection
      Meteor.call("addPic", image, content);
 
      // Clear form
      $('.content').val('');
      $('.image').val('');
    }

  });





  Template.pic.events({
    "click .delete": function () {
      Meteor.call("deletePic", this._id);
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
  addPic: function (image, content) {
    // Make sure the user is logged in before inserting image
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
 
    Pics.insert({
      image: image,
      content: content,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deletePic: function (picId) {
    Pics.remove(picId);
  }
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
