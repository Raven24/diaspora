/**
 * this view lets the user (de-)select aspect memberships in the context
 * of another users profile or the contact page.
 *
 * updates to the list of aspects are immediately propagated to the server, and
 * the results are dislpayed as flash messages.
 */
app.views.AspectMembership = Backbone.View.extend({

  initialize: function() {
    $('.dropdown.aspect_membership .dropdown_list > li')
      .live('click', _.bind(this._clickHandler, this));

    this.list_item = null;
    this.dropdown  = null;
  },

  _clickHandler: function(evt) {
    this.list_item = $(evt.target);
    this.dropdown  = this.list_item.parent();

    if( this.list_item.is('.selected') ) {
      var membership_id = this.list_item.data('membership_id');
      this.removeMembership(membership_id);
    } else {
      var aspect_id = this.list_item.data('aspect_id');
      var person_id = this.dropdown.data('person_id');
      this.addMembership(person_id, aspect_id);
    }

    return false; // stop the event
  },

  addMembership: function(person_id, aspect_id) {
    var aspect_membership = new app.models.AspectMembership({
      'person_id': person_id,
      'aspect_id': aspect_id
    });

    aspect_membership.on('sync', this._successSaveCallback, this);
    aspect_membership.on('error', this._errorSaveCallback, this);

    aspect_membership.save();
  },

  _successSaveCallback: function(evt) {
    console.log(arguments);
  },

  _errorSaveCallback: function(evt) {
    var name = this.dropdown.data('person-short-name');
    var msg = Diaspora.I18n.t('aspect_dropdown.error', { 'name': name });

    Diaspora.page.flashMessages.render({
      'success': false,
      'notice': msg
    });
  },

  removeMembership: function(membership_id) {
    var aspect_membership = new app.models.AspectMembership({
      'id': membership_id
    });

    aspect_membership.on('sync', this._successDestroyCallback, this);
    aspect_membership.on('error', this._errorDestroyCallback, this);

    aspect_membership.destroy();
  },

  _successDestroyCallback: function() {
    console.log(arguments);
  },

  _errorDestroyCallback: function() {
    console.log(arguments);
  }
});