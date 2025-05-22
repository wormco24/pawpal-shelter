// Header Component
const header = Vue.createApp({
  template: `
    <nav class="navbar navbar-expand-lg fixed-top">
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
    <footer>
      <div class="container text-center py-3">
        <p>&copy; 2025 PawPal Shelter. All rights reserved.</p>
      </div>
    </footer>
  `
});
footer.mount('#footer-component');

// Main App
const adoptableApp = Vue.createApp({
  data() {
    return {
      pets: [],
      selectedMaxAge: 0,
      selectedSpecies: [],
      selectedBreeds: [],
      sortOption: 'age-asc',
      maxAge: 0,
      minAge: 0
    };
  },
  computed: {
    availableSpecies() {
      const set = new Set();
      this.pets.forEach(p => {
        const age = parseInt(p.age);
        if (!isNaN(age) && age <= this.selectedMaxAge) {
          set.add(p.species);
        }
      });
      return [...set].sort();
    },
    availableBreeds() {
      const set = new Set();
      this.pets.forEach(p => {
        const age = parseInt(p.age);
        if (
          (!this.selectedSpecies.length || this.selectedSpecies.includes(p.species)) &&
          !isNaN(age) && age <= this.selectedMaxAge
        ) {
          set.add(p.breed);
        }
      });
      return [...set].sort();
    },
    filteredPets() {
      return this.pets.filter(pet => {
        const age = parseInt(pet.age);
        const matchesAge = !isNaN(age) && age <= this.selectedMaxAge;
        const matchesSpecies = !this.selectedSpecies.length || this.selectedSpecies.includes(pet.species);
        const matchesBreed = !this.selectedBreeds.length || this.selectedBreeds.includes(pet.breed);
        return matchesAge && matchesSpecies && matchesBreed;
      });
    },
    sortedPets() {
      const sorted = [...this.filteredPets];
      switch (this.sortOption) {
        case 'age-asc':
          sorted.sort((a, b) => parseInt(a.age) - parseInt(b.age));
          break;
        case 'age-desc':
          sorted.sort((a, b) => parseInt(b.age) - parseInt(a.age));
          break;
        case 'name-asc':
          sorted.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          sorted.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
      return sorted;
    }
  },
  mounted() {
    fetch('/.netlify/functions/getPets')
      .then(res => res.json())
      .then(data => {
        this.pets = data;

        const numericAges = this.pets.map(p => parseInt(p.age)).filter(n => !isNaN(n));
        this.maxAge = Math.max(...numericAges);
        this.minAge = Math.min(...numericAges);
        this.selectedMaxAge = this.maxAge;
      })
      .catch(err => console.error('Failed to load pets:', err));
  }
});
adoptableApp.mount('#adoptable-component');
