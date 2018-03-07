(function() {
    Vue.component("single-image", {
        template: '#single-image',
        props: ["id"],
        data: function() {
            return {
                image: "",
                username: "",
                title: "",
                description: "",
                // comments: []
            };
        },
        methods: {
            close: function() {
                console.log('close thing emiting');
                //of function directly can be selectedImage=null
                this.$emit("done");
            }
        },
        mounted: function() {
            console.log('Mounted function inside component');
            var app = this;
            axios.get("/image/" + this.id).then(function (results) {
                console.log('Got to the route with axios & here are results:', results.data.imageSingle);
                app.image = results.data.imageSingle.image;
                app.user = results.data.imageSingle.username;
                app.title = results.data.imageSingle.title;
                app.description = results.data.imageSingle.description;
            });
        }
    });

    //or there could be a component for comments(!)

    new Vue({
        el: "#main",
        data: {
            images: [],
            selectedImage: null, //set to id the user clicks and then in single image if

            formStuff: {
                username: "",
                description: "",
                title: "",
                file: void 0 //en empty value
            }
        },
        methods: {
            close: function(){
                this.selectedImage = null;
            },
            show: function(e) {
                console.log("click", e.target.nextElementSibling);
                e.target.nextElementSibling.style.display = "block";
            },
            //------calling the componenet so show up
            callComponent(image_id) {
                console.log("The image with id was called", image_id);
                this.selectedImage = image_id;
            },

            handleChange: function(e) {
                this.formStuff.file = e.target.files[0];
            },
            handleSubmit: function(e) {
                console.log("Inside handle submit");
                e.preventDefault();
                const formData = new FormData();
                formData.append("file", this.formStuff.file);
                formData.append("title", this.formStuff.title);
                formData.append("description", this.formStuff.description);
                formData.append("username", this.formStuff.username);

                axios.post("/upload", formData).then(results => {
                    console.log("Successfull upload", results);
                    //change the results.data.imageFilename
                    this.images.unshift({
                        id: results.data.id,
                        image: results.data.imageFilename,
                        username: this.formStuff.username,
                        title: this.formStuff.title,
                        descrition: this.formStuff.description
                    });
                    console.log(this.images);
                    //
                    // img data in results.data..image(?) we need to send the data
                    // unshift the new img to this.images /adding to the begining
                });
            }
        },
        mounted: function() {
            //lifecycle method
            var app = this;
            console.log("Mounted");
            axios.get("/images").then(function(results) {
                console.log(results.data);
                app.images = results.data.images;
            });
        }
    });
})();
