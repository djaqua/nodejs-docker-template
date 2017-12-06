var DEFAULT_PROTOTYPE_ITEM_TEXT = '';
var DEFAULT_FILTER_SHOW_COMPLETED = false;

/**
 * Represents an editor for the description of an entry within a To-Do list.
 */
var ItemEditor = Vue.extend({
  props: ['todo'],
  template: `
    <li class="list-item">
      <div class="item-actions">
        <span class="action-icon fa fa-save" aria-hidden="true" @click="saveText"></span>
        <span class="action-icon fa fa-undo" aria-hidden="true" @click="cancelEdit"></span>
      </div>
      <input class="item-text" type="text" ref="input" v-model="todo.text"
          @keyup.esc="cancelEdit" @keyup.enter="saveText" />
    </li>`,
  data: function() {
    return {
      textMemento: this.todo.text
    };
  },
  methods: {

    /**
     * cancelEdit - resets the text value of the todo back to its original state
     * and notifies concerned parties that the user cancelled the edit.
     *
     * @param  {type} event description
     * @return {type}       description
     */
    cancelEdit: function(event) {
      this.todo.text = this.textMemento;
      this.$emit('edit-cancelled');
    },
    saveText: function(event) {
      var self = this;
      this.$http.put('/updateText', {
        id: self.todo._id,
        text: self.todo.text
      }).then(function(data) {
          self.$emit('text-saved');
      }, function(error){
        console.log(error.responseText);
        self.$emit('text-not-saved');
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
var ItemEntry = Vue.extend({
  props: ['todo'],
  template: `
  <li v-if="this.todo.completed" class="list-item">
    <div class="item-actions">
      <input disabled v-if="todo.completed" type="checkbox" v-model="todo.completed" />
    </div>
    <label class="item-text" class="item-text" for="checkbox">{{ todo.text }}</label>
  </li>
  <li v-else class="list-item">
    <div class="item-actions">
      <input type="checkbox" @change="completeTodo" />
      <span class="action-icon fa fa-edit" aria-hidden="true" @click="$emit('edit-item')"></span>
    </div>
    <label class="item-text" for="checkbox" @dblclick="$emit('edit-item')">{{ todo.text }}</label>
  </li>`,

  methods: {

    completeTodo: function(event) {
      var self = this;
      this.$http.put('/complete', {
        id: self.todo._id
      }).then(function(data) {
          self.$emit('todo-completed');
      }, function(error){
        console.log(error.responseText);
        self.$emit('todo-not-completed');
      });
    }
  },

});

Vue.component('list-item-filter', {
  props: ['config'],
  template: `
  <div class="list-item-filter" >
    <input type="checkbox" name="showCompleted" @change="toggleShowCompleted"/>
    <label for="showCompleted">Show completed</label>
  </div>`,
  methods: {
    toggleShowCompleted: function() {
      this.config.showCompleted = !this.config.showCompleted;
      this.$emit('item-filters-changed');
    },
  }
});

Vue.component('list-item-builder', {
  template: `
  <input class="list-item-builder" type="text" v-model="text" @keyup.enter="persistEntry" @keyup.esc="cancelEntry" />
  `,
  data: function() {
    return {
      text: DEFAULT_PROTOTYPE_ITEM_TEXT
    };
  },
  methods: {
    cancelEntry: function() {
      this.text = DEFAULT_PROTOTYPE_ITEM_TEXT;
      this.$emit('entry-cancelled');
    },
    persistEntry: function() {
      var self = this;
      this.$http.post('/create', {
        text: self.text
      }).then(function(data) {
        self.text = DEFAULT_PROTOTYPE_ITEM_TEXT;
        self.$emit('todo-created');
      }, function(error) {
        self.$emit('todo-not-created');
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
    <component v-bind:is="currentView" v-bind:todo="todo"
      @text-saved="showEntry" @edit-cancelled="showEntry" @text-not-saved="handleError"
      @todo-completed="todoCompleted" @edit-item="showEditor"/>
    </component>`,

  data: function() {
    return {
      currentView: 'entry'
    };
  },

  methods: {
    showEditor: function() {
      if (!this.todo.completed) {
        this.currentView = 'editor';
      }
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
    entry: ItemEntry,
    editor: ItemEditor
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
    <ul class="todo-list">
      <list-item v-for="item in todoList" v-bind:todo="item" v-bind:key="item._id" @todo-completed="fetchData" />
      </list-item>
    </ul>
  </div>`,

  data: {
    filterConfig: {
      showCompleted: DEFAULT_FILTER_SHOW_COMPLETED
    },
    todoList: []
  },

  mounted: function() {
    this.fetchData();
  },

  methods: {
    fetchData: function() {
      var self = this;
      var fetchQuery = (this.filterConfig.showCompleted ? '?showCompleted' : '');
      this.$http.get('/all' + fetchQuery, {}).then(function(data) {
        self.todoList = data.body;
      }, function(err) {
        console.log("Error from server: " + err);
      });
    }
  }
});
