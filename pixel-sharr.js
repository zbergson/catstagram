Pics = new Mongo.Collection("pics");


if (Meteor.isClient) {
  Template.body.helpers({
    pics: function () {
      return Pics.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.body.events({
    "click #submit": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var content = $('.content').val();
      var image = $('.image').val();
      
      
 
      // Insert a task into the collection
      Pics.insert({
        image: image,
        content: content,
        createdAt: new Date(), // current time
        owner: Meteor.userId(),           // _id of logged in user
        username: Meteor.user().username  // username of logged in user
      });
 
      // Clear form
      $('.content').val('');
      $('.image').val('');
    }
  });

    Template.pic.events({
    "click .delete": function () {
      Pics.remove(this._id);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
