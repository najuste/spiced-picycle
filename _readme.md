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
