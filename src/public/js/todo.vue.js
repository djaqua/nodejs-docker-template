const DEFAULT_PROTOTYPE_ITEM_TEXT = '';

/**
 * Represents an editor for the description of an entry within a To-Do list.
 */
var TodoEditor = Vue.extend({
  props: ['todo'],
  template: `<input type="text" ref="input" v-model="todo.text"
                @keyup.esc="cancelEdit" @keyup.enter="saveText" />`,
  data: function() {
    return {
      textMemento: this.todo.text
    };
  },
  methods: {
    cancelEdit: function(event) {
      this.todo.text = this.textMemento;
      this.$emit("edit-cancelled");
    },
    saveText: function(event) {
      var self = this;
      $.ajax({
        url: `/updateText/${self.todo._id}/${self.todo.text}`,
        type: 'PUT',
        dataType: 'json', // what is expected back from the server

      }).done(function(data) {
          self.$emit("text-saved");
      }).fail(function(error){
        console.log(error.responseText);
        self.$emit("text-not-saved");
      });
    }
  },
  mounted: function() {
    this.$refs.input.focus();
  }
});



/**
 * Represents an entry within a To-Do list as a checkbox and a description
 * of the action to be performed.
 */
var TodoEntry = Vue.extend({
  props: ['todo'],
  template: `
  <div>
    <input disabled v-if="todo.completed" type="checkbox" v-model="todo.completed" >
    <input v-else type="checkbox"  @change="completeTodo">
    <label class="text" for="checkbox">{{ todo.text }}</label>
  </div>`,

  methods: {

    completeTodo: function(event) {
      var self = this;
      $.ajax({
        url: `/complete/${self.todo._id}`,
        type: 'PUT',
        dataType: 'json', // what is expected back from the server

      }).done(function(data) {
          self.$emit("todo-completed");
      }).fail(function(error){
        console.log(error.responseText);
        self.$emit("todo-not-completed");
      });
    }
  },

});

Vue.component('list-item-filter', {
  props: ['config'],
  template: `
  <div>
    <input type="checkbox" name="showCompleted" @change="toggleShowCompleted"/>
    <label for="showCompleted">Show completed</label>
  </div>`,
  methods: {
    toggleShowCompleted: function() {
      this.config.showCompleted = !this.config.showCompleted;
      this.$emit("item-filters-changed");
    },
  }
});

Vue.component('list-item-builder', {
  template: `
  <input type="text" v-model="text" @keyup.enter="persistEntry" @keyup.esc="cancelEntry" />
  `,
  data: function() {
    return {
      text: DEFAULT_PROTOTYPE_ITEM_TEXT
    };
  },
  methods: {
    cancelEntry: function() {
      this.text = DEFAULT_PROTOTYPE_ITEM_TEXT;
      this.$emit("entry-cancelled");
    },
    persistEntry: function() {
      var self = this;
      $.ajax({
        url: `/create/${self.text}`,
        type: 'POST',
        dataType: 'json'
      }).done(function(data) {
        self.text = DEFAULT_PROTOTYPE_ITEM_TEXT;
        self.$emit("todo-created");
      }).fail(function(error) {
        self.$emit("todo-not-created");
      });
    }
  }

});

/**
 * An abstaction over the contents of an
 */
Vue.component('list-item', {

  props: ['todo'],

  template: `
  <li @dblclick="showEditor">
    <component v-bind:is="currentView" v-bind:todo="todo"
      @text-saved="showEntry" @edit-cancelled="showEntry" @text-not-saved="handleError"
      @todo-completed="todoCompleted" />
    </component>
  </li>`,

  data: function() {
    return {
      currentView: 'entry'
    };
  },

  methods: {
    showEditor: function() {
      this.currentView = 'editor';
    },
    showEntry: function() {
      this.currentView = 'entry';
    },
    handleError: function() {
      alert("There was an error; check the console (F12) for details.");
    },
    todoCompleted: function() {
      this.$emit('todo-completed');
    }
  },
  components: {
    entry: TodoEntry,
    editor: TodoEditor
  }
});

/**
 * Initializes the Model-View at rhe DOM element identified by "#todo-list"
 */
var app = new Vue({
  el: '#todo-list-root',
  template: `
  <div>

    <list-item-builder @todo-created="fetchData"/>
    <list-item-filter v-bind:config="filterConfig" @item-filters-changed="fetchData"/>
    <ul>
      <list-item v-for="item in todoList" v-bind:todo="item" v-bind:key="item._id" @todo-completed="fetchData"></list-item>
    </ul>

  </div>`,

  data: {
    filterConfig: {
      showCompleted: false
    },
    todoList: []
  },

  mounted: function() {
    this.fetchData();
  },

  methods: {
    fetchData: function() {
      var self = this;
      $.ajax({
        url: '/all' + (self.filterConfig.showCompleted ? '?showCompleted' : '')
      }).done(function(data) {
        self.todoList = JSON.parse(data);
      }).fail(function(err) {
        console.log("Error from server: " + err);
      });
    }
  }
});
