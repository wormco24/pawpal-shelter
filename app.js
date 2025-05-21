// Header Component
const header = Vue.createApp({
  template: `
    <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="index.html">
          <img src="assets/logo.jpg" alt="Logo" width="30" height="30" />
          PawPal Shelter
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" :class="{ active: isActive('index.html') }" href="index.html">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: isActive('pets.html') }" href="pets.html">Pets</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: isActive('about.html') }" href="about.html">About</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: isActive('contact.html') }" href="contact.html">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  methods: {
    isActive(page) {
      return window.location.pathname.endsWith(page);
    }
  }
});
header.mount('#header-component');

// Footer Component
const footer = Vue.createApp({
  template: `
    <div class="bg-dark text-light py-4 text-center">
      <p>&copy; 2025 PawPal Shelter. All rights reserved.</p>
    </div>
  `
});
footer.mount('#footer-component');

// Adoptable Pets Component with Filtering
const adoptableApp = Vue.createApp({
  data() {
    return {
      pets: [],
      speciesFilter: '',
      maxAge: null
    };
  },
  computed: {
    filteredPets() {
      return this.pets.filter(pet => {
        const matchesSpecies =
          this.speciesFilter === '' || pet.species === this.speciesFilter;

        const petAge = parseInt(pet.age);
        const matchesAge =
          !this.maxAge || (petAge && petAge <= this.maxAge);

        return matchesSpecies && matchesAge;
      });
    }
  },
  mounted() {
    fetch('/.netlify/functions/getPets')
      .then(res => res.json())
      .then(data => {
        this.pets = data;
      })
      .catch(err => {
        console.error('Failed to load pets:', err);
      });
  }
});
adoptableApp.mount('#adoptable-component');
