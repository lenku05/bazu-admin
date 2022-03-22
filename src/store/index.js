import { createStore } from "vuex";
import { db, auth, storage } from "../firebase";
import router from "../router";
import createPersistedState from "vuex-persistedstate";
export default createStore({
  plugins: [
    createPersistedState({
      key: "vuex-admin",
    }),
  ],
  state: {
    blogs: [],
    files: [],
    user: {},
    error: {
      state: false,
      message: "",
    },
    success: {
      state: false,
      message: "",
    },
    authState: false,
    loading: false,
    notification: {
      snackbar: false,
      message: "",
      icon: "",
    },
  },
  getters: {
    blogs(state) {
      return state.blogs;
    },
    getNotification(state) {
      return state.notification;
    },
    getLoading(state) {
      return state.loading;
    },
    getUser(state) {
      return state.user;
    },
    getAuthState(state) {
      return state.authState;
    },
  },

  mutations: {
    LOAD_BLOGS(state, payload) {
      state.blogs = payload;
    },
    LOAD_FILES(state, payload) {
      state.files = payload;
    },
    CREATE_BLOG(state, blogdata) {
      state.blogs.push(blogdata);
    },
    CREATE_FILE(state, filedata) {
      state.files.push(filedata);
    },

    DELETE_BLOG(state, payload) {
      var index = state.blogs.findIndex((blog) => {
        return payload.id == blog.id;
      });
      state.blogs.splice(index, 1);
    },
    DELETE_FILE(state, payload) {
      var index = state.files.findIndex((file) => {
        return payload.id == file.id;
      });
      state.files.splice(index, 1);
    },

    UPDATE_BLOG(state, payload) {
      const blog = state.blogs.find((blog) => {
        return blog.id === payload.id;
      });
      if (payload.title) {
        blog.title = payload.title;
      }
      if (payload.body) {
        blog.body = payload.body;
      }
      if (payload.category) {
        blog.category = payload.category;
      }
      if (payload.image) {
        blog.image = payload.image;
      }
      if (payload.likes) {
        blog.likes = payload.likes;
      }
      if (payload.date) {
        blog.date = payload.date;
      }
    },
    SET_NOTIFICATION(state, payload) {
      state.notification.snackbar = payload.snackbar;
      state.notification.message = payload.message;
      state.notification.icon = payload.icon;
    },
    SET_AUTH_STATE(state, payload) {
      state.authState = payload;
    },
    SET_LOADING(state, payload) {
      state.loading = payload;
    },
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_ERROR(state, payload) {
      state.error = payload;
    },
    SET_SUCCESS(state, payload) {
      state.success = payload;
    },
  },

  actions: {
    loadBlogs({ commit, state }) {
      console.log(state.user.author);

      db.collection("blogs")
        .where("author", "==", state.user.author)
        .get()
        .then((querySnapshot) => {
          const blogs = [];
          querySnapshot.forEach((doc) => {
            const data = {
              id: doc.id,
              title: doc.data().title,
              body: doc.data().body,
              category: doc.data().category,
              date: doc.data().date,
              authorId: doc.data().authorId,
              author: doc.data().author,
              image: doc.data().image,
            };
            blogs.push(data);
            console.log(doc.id, " => ", doc.data());
          });
          commit("LOAD_BLOGS", blogs);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },
    loadFiles({ commit }) {
      db.collection("files")
        .get()
        .then((querySnapshot) => {
          const files = [];
          querySnapshot.forEach((doc) => {
            const data = {
              id: doc.id,
              title: doc.data().title,

              date: doc.data().date,

              file: doc.data().file,
            };
            files.push(data);
            console.log(doc.id, " => ", doc.data());
          });
          commit("LOAD_FILES", files);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },
    blogDelete({ commit }, payload) {
      const deleteImage = storage.refFromURL(payload.blog.image);
      deleteImage
        .delete()
        .then(() => {
          console.log("deleted");
          db.collection("blogs")
            .doc(payload.blog.id)
            .delete()
            .then(() => {
              console.log("successfully deleted");
              commit("DELETE_BLOG", payload);
            })
            .catch(() => {
              console.log("error while deleting");
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteFile({ commit }, payload) {
      const deleteImage = storage.refFromURL(payload.file);
      deleteImage
        .delete()
        .then(() => {
          console.log("deleted");
          db.collection("files")
            .doc(payload.id)
            .delete()
            .then(() => {
              console.log("successfully deleted");
              commit("DELETE_FILE", payload);
            })
            .catch(() => {
              console.log("error while deleting");
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    imageDelete(payload) {
      // console.log(payload);
      const deleteImage = storage.refFromURL(payload.image);
      deleteImage
        .delete()
        .then(() => {
          console.log("deleted");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    uploadFile({ commit }, payload) {
      // console.log(payload);
      commit("SET_LOADING", true);

      // image upload
      const file = payload.file;
      const filename = new Date().toISOString() + "-" + file.name;
      const bucket = storage.ref("files/" + filename);
      let uploadTask = bucket.put(file);

      uploadTask.on(
        "state_change",
        //uplod progress
        (snapshot) => {
          let percentage = parseInt(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log("Upload is " + percentage + "% done");
          // this.progress = percentage;
        },
        //error on upload
        (error) => {
          console.log(error);
        },
        //sucess after upload
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log("File available at", downloadURL);
            // upload doc
            const file = {
              title: payload.title,
              date: payload.date,
              file: downloadURL,
            };
            db.collection("files")
              .add(file)
              .then((doc) => {
                const id = doc.id;
                const filedata = {
                  id: id,
                  title: payload.title,
                  date: payload.date,
                  file: downloadURL,
                };
                commit("CREATE_FILE", filedata);
                commit("SET_LOADING", false);
                commit("SET_SUCCESS", {
                  state: true,
                  message: "The file has been uploaded successifuly",
                });
                setTimeout(() => {
                  commit("SET_SUCCESS", {
                    state: false,
                    message: "",
                  });
                  // router.push("/");
                }, 2500);
              })
              .catch(function (error) {
                commit("SET_ERROR", {
                  state: true,
                  message: error.message,
                });
                setTimeout(
                  () =>
                    commit("SET_ERROR", {
                      state: false,
                      message: "",
                    }),
                  2500
                );
                commit("SET_LOADING", false);
              });
          });
        }
      );

      // image upload
    },
    createblog({ commit, state }, payload) {
      // console.log(payload);
      commit("SET_LOADING", true);

      // image upload
      const file = payload.file;
      const filename = new Date().toISOString() + "-" + file.name;
      const bucket = storage.ref("blogs/" + filename);
      let uploadTask = bucket.put(file);

      uploadTask.on(
        "state_change",
        //uplod progress
        (snapshot) => {
          let percentage = parseInt(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log("Upload is " + percentage + "% done");
          // this.progress = percentage;
        },
        //error on upload
        (error) => {
          console.log(error);
        },
        //sucess after upload
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log("File available at", downloadURL);
            // upload doc
            const blog = {
              title: payload.title,
              category: payload.category,
              author: state.user.author,
              body: payload.body,
              date: payload.date,
              image: downloadURL,
            };
            db.collection("blogs")
              .add(blog)
              .then((doc) => {
                const id = doc.id;
                const blogdata = {
                  id: id,
                  title: payload.title,
                  authorId: state.author,
                  author: state.user.name,
                  category: payload.category,
                  body: payload.body,
                  date: payload.date,
                  image: downloadURL,
                };
                commit("CREATE_BLOG", blogdata);
                commit("SET_LOADING", false);
                commit("SET_SUCCESS", {
                  state: true,
                  message: "The blog has been published successifuly",
                });
                setTimeout(() => {
                  commit("SET_SUCCESS", {
                    state: false,
                    message: "",
                  });
                  router.push("/");
                }, 2500);
              })
              .catch(function (error) {
                commit("SET_ERROR", {
                  state: true,
                  message: error.message,
                });
                setTimeout(
                  () =>
                    commit("SET_ERROR", {
                      state: false,
                      message: "",
                    }),
                  2500
                );
                commit("SET_LOADING", false);
              });
          });
        }
      );

      // image upload
    },
    blogUpdate({ commit }, payload) {
      if (payload.file) {
        // bigin
        commit("SET_LOADING", true);

        // image upload
        const file = payload.file;
        const filename = new Date().toISOString() + "-" + file.name;
        const bucket = storage.ref("blogs/" + filename);
        let uploadTask = bucket.put(file);

        uploadTask.on(
          "state_change",
          //uplod progress
          (snapshot) => {
            let percentage = parseInt(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log("Upload is " + percentage + "% done");
            // this.progress = percentage;
          },
          //error on upload
          (error) => {
            console.log(error);
          },
          //sucess after upload
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              console.log("File available at", downloadURL);
              // upload doc
              const blog = {
                title: payload.title,
                category: payload.category,
                body: payload.body,
                image: downloadURL,
              };
              db.collection("blogs")
                .doc(payload.id)
                .update(blog)
                .then(() => {
                  commit("UPDATE_BLOG", payload);
                  commit("SET_SUCCESS", {
                    state: true,
                    message: "Blog has been updated successifuly",
                  });
                  setTimeout(() => {
                    commit("SET_LOADING", false);

                    commit("SET_SUCCESS", {
                      state: false,
                      message: "",
                    });
                    router.push("/");
                  }, 3500);
                })
                .catch((error) => {
                  console.log(error);
                  commit("SET_LOADING", false);

                  commit("SET_ERROR", {
                    state: true,
                    message: error.message,
                  });
                  setTimeout(
                    () =>
                      commit("SET_ERROR", {
                        state: false,
                        message: "",
                      }),
                    3500
                  );
                });
            });
          }
        );
        // end
      } else {
        commit("SET_LOADING", true);

        // console.log(payload)
        const updateblog = {};
        if (payload.title) {
          updateblog.title = payload.title;
        }
        if (payload.image) {
          updateblog.image = payload.image;
        }
        if (payload.category) {
          updateblog.category = payload.category;
        }
        if (payload.body) {
          updateblog.body = payload.body;
        }

        db.collection("blogs")
          .doc(payload.id)
          .update(updateblog)
          .then(() => {
            commit("UPDATE_BLOG", payload);
            commit("SET_SUCCESS", {
              state: true,
              message: "Blog has been updated successifuly",
            });
            setTimeout(() => {
              commit("SET_LOADING", false);

              commit("SET_SUCCESS", {
                state: false,
                message: "",
              });
              router.push("/");
            }, 3500);
          })
          .catch((error) => {
            console.log(error);
            commit("SET_LOADING", false);

            commit("SET_ERROR", {
              state: true,
              message: error.message,
            });
            setTimeout(
              () =>
                commit("SET_ERROR", {
                  state: false,
                  message: "",
                }),
              3500
            );
          });
      }
    },
    // auth
    userSignUp({ commit }, payload) {
      commit("SET_LOADING", true);
      auth
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then((user) => {
          const data = {
            email: payload.email,
            author: payload.author,
            authorId: user.user.uid,
          };
          // create a doc for admins
          db.collection("admins")
            .doc(user.user.uid)
            .set(data)
            .then(() => {
              console.log("Document successfully written!");
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
            });
          // end
          commit("SET_LOADING", false);
          commit("SET_SUCCESS", {
            state: true,
            message: "Admin has been registered successifuly",
          });
          setTimeout(
            () =>
              commit("SET_SUCCESS", {
                state: false,
                message: "",
              }),
            3500
          );
        })
        .catch((error) => {
          // look at type of error
          commit("SET_LOADING", false);

          commit("SET_ERROR", {
            state: true,
            message: error.message,
          });
          setTimeout(
            () =>
              commit("SET_ERROR", {
                state: false,
                message: "",
              }),
            3500
          );
        });
    },
    userSignIn({ commit, dispatch }, payload) {
      commit("SET_LOADING", true);
      // console.log(payload)
      auth
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then((user) => {
          // get user from firestore
          console.log(user.user.uid);
          db.collection("admins")
            .doc(user.user.uid)
            .get()
            .then((doc) => {
              // const users = [];
              console.log(doc.data());

              commit("SET_USER", doc.data());
              dispatch("loadBlogs");
            })
            .catch((error) => {
              console.log(error);
            });
          console.log("logged in");

          commit("SET_LOADING", false);
          commit("SET_AUTH_STATE", true);
          // redirect
          router.push("/");
        })
        .catch((error) => {
          console.log(error);
          commit("SET_LOADING", false);
          commit("SET_ERROR", {
            state: true,
            message: error.message,
          });
          setTimeout(
            () =>
              commit("SET_ERROR", {
                state: false,
                message: "",
              }),
            3500
          );
        });
    },
    logOutUser({ commit }) {
      auth.signOut().then(() => {
        commit("SET_AUTH_STATE", false);

        window.localStorage.removeItem("vuex-admin");
        router.push("/login");
        // commit("SET_AUTH_STATE", false);
        // window.location.reload();
      });
    },
  },
});
