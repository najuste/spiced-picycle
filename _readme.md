#comments on Vue.js in html file

<div id="main">
    <p>{{Hello world}}</p>
    <!-- this will get a class heading since there is  property headingClassName in Vue instnce -->
     <h1 v-bind:class="headingClassName">{{ heading }}</h1>
     <!-- also possible: it is getting as property from the script.js  -->
     <h1 :class="headingClassName" :id="headingClassName">{{ heading }}</h1>
     <!-- v-if is for IF class, cities is a property searched in data of Vue -->
     <ul v-if="cities.length > 0">
         <!-- city is just a variable to loop through and -->
        <li v-for="city in cities">{{city.name}}, {{city.country}}
    </ul>

</div>

////FROM CLASS David's code

<!doctype html>

<html>
<head>
    <title></title>
</head>
<body>

    <div id="main">
        {{heading}}

        <ul v-if="cities.length > 0">
            <li v-for="c in cities" @click="clicked">
                <individual-city v-on:please="changeHeading"
                                 v-bind:heading="heading"
                                 v-bind:id="c.id"
                                 v-bind:name="c.name"
                                 v-bind:country="c.country"></individual-city>

            </li>

        </ul>
        <input v-model="heading">
    </div>

    <script id="some-template" type="x-template">
        <div>
            <h3>{{heading}}</h3>
            <em><strong>{{name}}, {{country}}</strong></em>
            <input v-on:input="update">
        </div>
    </script>

    <script src="/js/vue.js"></script>
    <script src="/js/axios.min.js"></script>
    <script src="/js/script.js"></script>

</body>
</html>

<!-- v-on:done /that's the event name/="closed" /function/  -->

<!-- props=> id of the image the user clicked
and make again the ajax request (one to get data from both tables or 2 requests are ok too)
to get the specific data (for 4 part it's needed)  -->
