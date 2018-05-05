(function() {
    Vue.component("single-image", {
        template: "#single-image",
        props: ["id"],
        data: function() {
            return {
                image: "",
                username: "",
                title: "",
                description: "",
                comments: [],
                formComment: {
                    username: "",
                    comment: ""
                }
            };
        },
        watch: {
            id: function() {
                this.getSingleImageData();
            }
        },
        methods: {
            close: function() {
                this.$emit("done");
            },
            commentFormSubmit: function(e) {
                e.preventDefault();
                var app = this;
                var data = {
                    username: app.formComment.username,
                    comment: app.formComment.comment,
                    image_id: app.id
                };
                axios
                    .post("/comments/" + this.id, data)
                    .then(results => {
                        app.comments.unshift(results.data.comments[0]);
                    })
                    .catch(err => console.log(err));
            },
            getSingleImageData: function() {
                var app = this;
                var id = app.id;
                axios
                    .get("/image/" + id)
                    .then(function(results) {
                        app.image = results.data.imageSingle.image;
                        app.username = results.data.imageSingle.username;
                        app.title = results.data.imageSingle.title;
                        app.description = results.data.imageSingle.description;

                        axios
                            .get("/comments/" + id)
                            .then(function(results) {
                                app.comments = results.data.comments;
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));
            }
        },
        mounted: function() {
            this.getSingleImageData();
        }
    });

    //or there could be a component for comments(!)
    new Vue({
        el: "#main",
        data: {
            images: [],
            selectedImage: location.hash.slice(1) || null,
            formStuff: {
                username: "",
                description: "",
                title: "",
                file: void 0
            },
            showForm: false
        },

        methods: {
            close: function() {
                this.selectedImage = null;
                document.body.style.overflow = "initial";
                this.removeHash();
            },
            show: function(e) {
                if (!this.showForm) {
                    this.showForm = true;
                    e.target.nextElementSibling.style.display = "block";
                } else {
                    this.showForm = false;
                    e.target.nextElementSibling.style.display = "none";
                }
            },
            callComponent(image_id) {
                this.selectedImage = image_id;
                document.body.style.overflow = "hidden";
            },
            handleChange: function(e) {
                this.formStuff.file = e.target.files[0];
                console.log("From changes:", this.formStuff);
            },
            handleSubmit: function() {
                const formData = new FormData();
                formData.append("username", this.formStuff.username);
                formData.append("description", this.formStuff.description);
                formData.append("title", this.formStuff.title);
                formData.append("file", this.formStuff.file);
                axios
                    .post("/upload", formData)
                    .then(results => {
                        for (var i in this.formStuff) {
                            this.formStuff[i] = "";
                        }
                        console.log(results.data);
                        this.images.unshift(results.data.image);
                    })
                    .catch(err => console.log(err));
            },
            handleScroll() {
                if (
                    document.body.clientHeight - window.scrollY <=
                    window.innerHeight
                ) {
                    this.getNextImages();
                } else {
                    setTimeout(this.handleScroll, 1000);
                }
            },
            getNextImages: function() {
                var app = this;
                let nextbatch = app.images.length;
                axios
                    .get("/images/" + nextbatch)
                    .then(function(results) {
                        results.data.images.forEach(item => {
                            app.images.push(item);
                        });
                    })
                    .catch(err => console.log(err));
            },
            removeHash: function() {
                history.pushState(
                    "",
                    document.title,
                    window.location.pathname + window.location.search
                );
            }
        },

        mounted: function() {
            var app = this;
            axios
                .get("/images")
                .then(function(results) {
                    app.images = results.data.images;
                })
                .catch(err => console.log(err));
            addEventListener("hashchange", function() {
                app.selectedImage = location.hash.slice(1);
            });
        },
        updated: function() {
            addEventListener("scroll", this.handleScroll());
        }
    });
})();
