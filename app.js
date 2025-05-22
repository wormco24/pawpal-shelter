// Header Component
const header = Vue.createApp({
  template: `
    <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="index.html">
          <img src="assets/logoShelter.png" alt="Logo" width="30" height="30" />
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
    <div class="bg-section-even text-center py-3">
      <p class="mb-0">&copy; 2025 PawPal Shelter. All rights reserved.</p>
    </div>
  `
});
footer.mount('#footer-component');

// Adoptable Pets Page
if (document.getElementById('adoptable-component')) {
  const adoptableApp = Vue.createApp({
    data() {
      return {
        pets: [],
        maxAge: 0,
        selectedMaxAge: 0,
        selectedSpecies: [],
        selectedBreed: '',
        sortOption: 'name-asc'
      };
    },
    computed: {
      availableSpecies() {
        const speciesSet = new Set();
        this.pets.forEach(pet => {
          if (pet.age <= this.selectedMaxAge) {
            speciesSet.add(pet.species);
          }
        });
        return [...speciesSet];
      },
      availableBreeds() {
        const breedSet = new Set();
        this.pets.forEach(pet => {
          const matchSpecies = this.selectedSpecies.length === 0 || this.selectedSpecies.includes(pet.species);
          if (pet.age <= this.selectedMaxAge && matchSpecies) {
            breedSet.add(pet.breed);
          }
        });
        return [...breedSet];
      },
      filteredPets() {
        return this.pets.filter(pet => {
          const matchAge = pet.age <= this.selectedMaxAge;
          const matchSpecies = this.selectedSpecies.length === 0 || this.selectedSpecies.includes(pet.species);
          const matchBreed = this.selectedBreed === '' || pet.breed === this.selectedBreed;
          return matchAge && matchSpecies && matchBreed;
        });
      },
      sortedPets() {
        const sorted = [...this.filteredPets];
        switch (this.sortOption) {
          case 'name-asc':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-desc':
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'age-asc':
            sorted.sort((a, b) => a.age - b.age);
            break;
          case 'age-desc':
            sorted.sort((a, b) => b.age - a.age);
            break;
        }
        return sorted;
      }
    },
    mounted() {
      fetch('adoptable.json')
        .then(res => res.json())
        .then(data => {
          this.pets = data.map(pet => ({
            ...pet,
            image: `assets/${pet.name}.jpg`
          }));
          this.maxAge = Math.max(...this.pets.map(p => p.age));
          this.selectedMaxAge = this.maxAge;
        })
        .catch(err => {
          console.error('Failed to load pets:', err);
        });
    },
    methods: {
      resetFilters() {
        this.selectedMaxAge = this.maxAge;
        this.selectedSpecies = [];
        this.selectedBreed = '';
      }
    }
  });
  adoptableApp.mount('#adoptable-component');
}

// Homepage Featured Pets
if (document.getElementById('featured-pets')) {
  const featured = Vue.createApp({
    data() {
      return { pets: [] };
    },
    mounted() {
      fetch('adoptable.json')
        .then(res => res.json())
        .then(data => {
          this.pets = data.slice(0, 3).map(pet => ({
            ...pet,
            image: `assets/${pet.name}.jpg`
          }));
        });
    }
  });
  featured.mount('#featured-pets');
}
