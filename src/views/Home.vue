<template>
  <div class="fp-extension-landing-page">
    <div class="fp-extension-saleschannel-title">Sales Channel</div>

    <loader v-if="pageLoading"></loader>
    <div v-else class="content">
      <nitrozen-input
        type="search"
        placeholder="Search Sales Channels"
        :showSearchIcon="true"
        class="application-list"
        @input="searchApplication"
        >
      </nitrozen-input>

      <div class="fp-extension-sales-channels-container">
        <div
          :key="application._id"
          class="fp-extension-app-box"
          v-for="application of applications_list"
          >

          <div class="logo">
            <img :src="application.logo" />
          </div>
          <div class="line-1">{{ application.name }}</div>
          <div class="line-2">{{ application.domain.name }}</div>
          <div class="fp-extension-list-btn-cont">
            <nitrozen-toggle-btn
              v-model="application.script_state"
              @change="togChange(application._id, application.script_state)"
              >
            </nitrozen-toggle-btn>
          </div>
        </div>

        <div
          v-if="applications_list.length % 3 == 2"
          class="fp-extension-app-box hidden"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* File imports */
import Loader from "../components/loader.vue";
import { NitrozenInput, NitrozenToggleBtn } from "@gofynd/nitrozen-vue";

/* Service imports */
import MainService from "./../services/main-service";

export default {
  name: "fp-extension-homepage",
  components: {
    Loader,
    "nitrozen-input": NitrozenInput,
    'nitrozen-toggle-btn': NitrozenToggleBtn
  },
  data() {
    return {
      applications_list: [],
      all_applications: [],
      pageLoading: false,
      proxyLoader: false
    };
  },
  mounted() {
    this.fetchApplications();
  },
  methods: {
    fetchApplications() {
      this.pageLoading = true;
      MainService.getAllApplications()
        .then(({ data }) => {
          this.all_applications = data.items;
          this.applications_list = data.items;
          this.applications_list.map((ele) => {
            (ele.text = ele.name),
              (ele.value = ele._id),
              (ele.image = ele.logo),
              (ele.logo = ele.image && ele.image.secure_url);
          });
          this.pageLoading = false;
        })
        .catch(() => {
          this.pageLoading = false;
          this.$snackbar.global.showError(
            "Failed to fetch the list of all applications"
          );
        });
    },
    searchApplication(searchText) {
      if (!searchText) {
        this.applications_list = this.all_applications.map((app) => app);
      } else {
        this.applications_list = this.all_applications.filter((item) => {
          return item.name.toLowerCase().includes(searchText.toLowerCase());
        });
      }
    },
    navigateToApplication(id){
      MainService.getAllApplicationById(id).then(({ data }) => {
        console.log(data,"success")
      }).catch(err => {
        console.log(err)
      })
    },

    // Injectable Methods
    getInjectableTags(id) {
      MainService.getInjectableTagsById(id).then(({ data }) => {
        console.log("#########", data)
      }).catch(err => {
        console.log(err)
      })
    },

    // Button Methods
    togChange(application_id, state){
      if (state) {
        console.log("Inside If")
        MainService.addInjecttableTagsById(application_id).then(() => {
          console.log("Script Injected")
        }).catch(err => {
          console.log(err)
        })
        this.getProxy(application_id)

      } else {
        console.log("Inside Else")
        MainService.removeInjectableTagsById(application_id).then(() => {
          console.log("Injected Script Removed!!")
        }).catch(err => {
          console.log(err)
        })
        this.removeProxy(application_id)
      }
    },

    // proxy methods
    getProxy(application_id) {
      this.proxyLoader = true;
      return MainService.getProxy(application_id).then(() => {
        this.proxyLoader = false
      }).catch((err) => {
        console.log(err.response, "getProxy Error")
        if (err.response.status == 400) {
          this.addProxy(application_id)
        } else {
          this.proxyLoader = false
        }
      })
    },

    addProxy(application_id) {
      return MainService.addProxy(application_id).then((res) => {
        console.log(res, "addProxy Response")
      }).catch((err) => {
        console.log(err.response, "addProxy Error")
      }).finally(() => {
        this.proxyLoader = false
      })
    },

    removeProxy(application_id) {
      return MainService.removeProxy(application_id).then((res) => {
        console.log(res, "removeProxy Response")
      }).catch((err) => {
        console.log(err.response, "removeProxy Error")
      }).finally(() => {
        this.proxyLoader = false
      })
    }
  },
};
</script>

<style lang="less" scoped>
.fp-extension-landing-page {
  font-family: "Inter";
  position: relative;
  width: 100%;
  box-sizing: border-box;
  max-width: 1024px;
  margin: 24px auto;

  .fp-extension-saleschannel-title {
    font-weight: 700;
    font-size: larger;
    margin-bottom: 8px;
  }

  .fp-extension-sales-channels-container {
    display: flex;
    flex-wrap: wrap;
    margin: 24px 0;
    justify-content: space-between;

    .fp-extension-list-btn-cont {
      display: flex;
      justify-content: flex-end;

      .fp-extension-list-btn {
        display: flex;
        width: 40px;
        height: 40px;
        border: 1px solid #e4e5e6;
        border-radius: 4px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }
  }

  .fp-extension-app-box {
    width: 261px;
    height: auto;
    background-color: white;
    border: 1px solid #e4e5e6;
    padding: 24px;
    border-radius: 4px;
    margin-bottom: 24px;

    & + .fp-extension-app-box:nth-child(3n + 1) {
      margin-left: 0;
    }

    .logo {
      width: 48px;
      height: 48px;

      img {
        width: 100%;
        height: auto;
      }
    }

    .line-1 {
      font-weight: 600;
      font-size: 16px;
      line-height: 26px;
    }

    .line-2 {
      color: #9b9b9b;
      line-height: 22px;
      font-size: 12px;
    }
  }
}

.hidden {
  visibility: hidden;
}
</style>
