var app = app || {};

app.View.AddressSearchView = Backbone.View.extend({
    el: "#addressSearch",
    model: app.Model.AddressSearch,
    template: $("#addressSearchTemplate").html(),

    events: {
        'keyup .js__address-search-input': "setValue"
    },

    initialize: function() {

        // create the address search model/view
        this.model = new app.Model.AddressSearch();

        // set a listener for changes to the value of the address search
        this.listenTo(this.model, "change:value", this.query);

        this.listenTo(this.model, "change:results", this.render);

        // render the view
        this.render();
    },

    render: function() {
        //parse the template
        var templ = _.template(this.template);

        // set this elements html to the model rendered in the template
        this.$el.html(templ(this.model.toJSON()));
        return this;
    },

    setValue: function(e) {
        // if the value of the text is greater than 3, update the value in the model
        if(e.target.value.length > 3) {
            this.model.set("value",e.target.value);    
        }
    },

    query: function() {
        this.getResults(this.model.get("value"));
    },

    /**
     * Gets the address search results for a given address string
     * @param  {String} addressStr [a full or partial address string]
     * @return {[Array]} [an array of address results objects]
     */
    getResults: function(addressStr) {
        // only query strings longer than 3 characters
        if(addressStr.length > 3) {

            var geocoder = new google.maps.Geocoder();
            var options = {
                address: addressStr + ', Northampton',
                region: 'GB'
            };

            var addresses = this.model.get("results");

            geocoder.geocode(options,function(results, status) {

                if(status === google.maps.GeocoderStatus.OK) {
                    addresses = results;
                }
                else {
                    addresses = [];
                }

                
            });

            this.setResults(addresses);
        }
    },

    setResults: function(addresses) {
        this.model.set("results",addresses);
    }
});