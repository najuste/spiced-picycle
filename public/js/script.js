(function() {
    new Vue({
        el: "#main",
        data: {
            images: []
        },
        methods: {
            showtext: function(e) {
                e.stopPropagation();
                console.log(e.target);
                // e.target.children.style.display = "block";
            }
        },
        mounted: function() {
            //lifecycle method
            var app = this;
            console.log("Mounted");
            axios.get("/images").then(function(results) {
                console.log("Got here", results.data);
                app.images = results.data.images;
            });
        }
    });
})();
