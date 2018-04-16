$(document).ready(function () {

    // this is an object that will essentially wrap the data/array of image
    // objects returned from GIPHY
    function GIPHYResponse() {
        this.giphyData = null;
        this.pictures = $("#pictures");
        this.stillStr = "downsized_still";
        this.animatedStr = "downsized";

        let self = this;

        // this will be listening to any images added to the document
        // if the images are clicked, toggle them from still to animated
        this.pictures.on("click", "img", function () {
            console.log($(this));
            let imageIDnumber = parseInt($(this).attr("id").substring(3));

            if ($(this).attr("src") ==
                self.giphyData[imageIDnumber].images[self.stillStr].url) {
                $(this).attr("src",
                    self.giphyData[imageIDnumber].images[self.animatedStr].url);
            }
            else {
                $(this).attr("src",
                    self.giphyData[imageIDnumber].images[self.stillStr].url);
            }

        });
    }

    // we must have clicked a new tag/button  
    // wrap the new object, delete old images and print the new ones
    GIPHYResponse.prototype.reset = function (giphyResponseData) {
        this.giphyData = giphyResponseData;
        this.pictures.empty();
        this.createImages();
    }

    // create the image, rating, and wrapping element
    GIPHYResponse.prototype.createIMG = function (id, src, rating) {
        let imgContainer = $("<figure>");
        imgContainer.append($("<img>").attr("id", id).attr("src", src));
        imgContainer.append($("<figcaption>").text(rating.toUpperCase()).addClass("rating"));
        imgContainer.appendTo("#pictures");
    }
    // run through all the resulting images and print/create
    GIPHYResponse.prototype.createImages = function () {
        for (let i = 0; i < this.giphyData.length; i++) {
            this.createIMG(`gif${i}`,
                this.giphyData[i].images[this.stillStr].url,
                this.giphyData[i].rating
            );
        }
    }

    let giphyObject = new GIPHYResponse();



    // initial array of tags for the buttons
    let tags = [
        "Macho Man",
        "Ultimate Warrior",
        "Mil Muertes",
        "Pentagon Dark",
        "Joey Ryan",
        "Bray Wyatt",
        "Alexa Bliss",
        "Rhonda Rousey",
        "Hulk Hogan",
        "John Cena",
        "Andre the Giant",
        "Stone Cold Steve Austin"];

    // Create a button from a tag
    tags.createButton = function (tagText) {
        $("<button>").text(tagText + " ").addClass("btn btn-primary").appendTo($("#tags"));
    };

    // Initialize the page by creating a button for each tag
    // in the array 
    // Start listening for clicks on the buttons
    tags.init = function () {
        for (let i = 0; i < tags.length; i++) {
            this.createButton(tags[i]);
            console.log(encodeURIComponent(tags[i]));
        }
        this.listenForClicks();
    };

    // add a new tag to the array and add it to the DOM
    tags.addElement = function (tagText) {
        this.push(tagText);
        this.createButton(tagText);
    };

    // listen to clicks on the buttons and request
    // from GIPHY the gifs related to the button text
    tags.listenForClicks = function () {

        // must listen to #tags div to account for dynamically
        // created buttons
        $("#tags").on("click", ".btn", function () {

            console.log($(this).text());

            let searchTerm = encodeURIComponent($(this).text());
            let requestedGIFS = "10";
            let queryURL = `https://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=MSfEV1eyHtNS3mXorDXyqTQ7JB6jY8Pi&limit=${requestedGIFS}`;

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                console.log("success got data", response);
                giphyObject.reset(response.data);
            });
        });
    };

    tags.init();




    // This is an object to store the custom tags input by users
    // It is using localStorage
    function CustomTagStorage() {
        this.storageAvailable = (typeof (Storage) !== "undefined");
        this.customTagKey = "gifMadnessCustomTags";
        if (!this.storageAvailable) {
            console.log("LocalStorage not available to save custom tags.");
        }
        else {
            console.log("LocalStorage available to save custom tags.");
            // add the existing tags to the array
            debugger
            let result = this.retrieve();
            if (result) {
                tags.addElement(result);
            }
        }
    }

    CustomTagStorage.prototype.add = function (tag) {
        debugger
        if (this.storageAvailable && tag) {
            let existingTags = this.retrieve();
            localStorage.setItem(this.customTagKey,
                (existingTags ? existingTags + tag : tag));
        }
    };

    CustomTagStorage.prototype.retrieve = function () {
        let results = "";
        if (this.storageAvailable) {
            results = localStorage.getItem(this.customTagKey);
            console.log(`existing tags: ${results}`);
        }
        return results;
    };

    CustomTagStorage.prototype.reset = function () {
        if (this.storageAvailable) {
            localStorage.removeItem(this.customTagKey);
        }
    }

    let storage = new CustomTagStorage();
    //storage.reset();


    // this is a class that can be used to toggle on and off those irritating
    // ratings
    function RatingsToggler() {
        this.element = $("#showRatings");
        this.showRatingsString = "Show Ratings";

        let self = this;

        $("#showRatings").click(function (event) {
            event.preventDefault();
            console.log(event);

            if (self.element.text() == self.showRatingsString) {
                self.element.text("Hide Ratings");
                $(".rating").show();  // why won't these work when I cache them?
            }
            else {
                self.element.text(self.showRatingsString);
                $(".rating").hide();  // why won't these work when I cache them?
            }
        });
    }

    let toggler = new RatingsToggler();


    // we need to listen to the submit button and add any requested text as
    // tags to the array
    let customTagElement = $("#customTag");
    $("#submitButton").click(function (event) {
        console.log(customTagElement);
        debugger
        if (customTagElement.val()) {
            tags.addElement(customTagElement.val());
            storage.add(customTagElement.val());
            customTagElement.val("");
        }
    });

});