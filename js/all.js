Vue.component("country-modal", {
  template: "#country-component",
  props: ["country"],
  data() {
    return {};
  },
});

Vue.component("pagination", {
  template: "#pagination-component",
  props: ["paginationInfo"],
  data() {
    return {
      pagination: this.paginationInfo,
    };
  },
  methods: {
    changeData(page) {
      this.pagination.currentPage = page - 1;
      this.$emit("changepage", this.pagination.currentPage);
    },
  },
});

new Vue({
  el: "#app",
  data: {
    countries: [],
    filterCountries: [],
    pageCountries: [],
    pagination: {},
    country: {},
    sort: null,
    search: "",
  },
  methods: {
    getCountries() {
      const vm = this;
      axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
        vm.countries = response.data;
        vm.filterCountries = response.data;
        vm.page();
      });
    },
    compare(a, b) {
      const vm = this;
      if (vm.sort) {
        // 小到大
        return a.name > b.name ? 1 : -1;
      } else {
        // 大到小
        return a.name < b.name ? 1 : -1;
      }
    },
    findCountry() {
      const vm = this;
      if (vm.search === "") {
        vm.filterCountries = vm.countries;
      } else {
        vm.filterCountries = vm.countries.filter(
          (item) => item.name.indexOf(vm.search) !== -1
        );
      }

      vm.page();
    },
    page() {
      // 有幾頁
      // 每頁有幾筆
      // newData  [[1...], [2...], [3...]]
      const vm = this;
      const newData = [];

      vm.filterCountries.forEach((item, i) => {
        if (i % 25 === 0) {
          newData.push([]);
        } // if
        // console.log(this);
        const page = parseInt(i / 25);
        newData[page].push(item);
      });

      vm.pageCountries = newData;
      vm.filterCountries = vm.pageCountries[0] || [];
      vm.pagination = {
        currentPage: 0,
        dataPage: vm.pageCountries.length,
      };
    },
    newPageData(page) {
      this.pagination.currentPage = page;
      this.filterCountries = this.pageCountries[page];
    },
  },
  created() {
    this.getCountries();
  },
});
