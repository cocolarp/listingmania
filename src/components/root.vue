<template>
  <div>
    <div id='request-filters' class='row form-horizontal margin-bottom filters'>

      <div class='form-group'>
        <label class='col-xs-2 control-label' translate>Période</label>
        <div class='col-xs-10'>
          <div class='btn-group btn-group-justified'>
            <btn-item v-on:toggle="updateUrl" v-for='month in months' :key='month.code' v-bind='month'></btn-item>
          </div>
        </div>
      </div>

      <div class='form-group'>
        <label class='col-xs-2 control-label' translate>Durée</label>
        <div class='col-xs-10'>
          <div class='btn-group btn-group-justified'>
            <btn-item v-on:toggle="updateUrl" v-for='duration in durations' :key='duration.code' v-bind='duration'></btn-item>
          </div>
        </div>
      </div>

      <div class='form-group'>
        <label class='col-xs-2 control-label' translate>Pays</label>
        <div class='col-xs-10'>
          <div class='dropdown'>
            <button class='btn dropdown-toggle' type='button' data-toggle='dropdown'>
              {{ country.text }}
            </button>
            <ul class='dropdown-menu scrollable-menu' aria-labelledby='dropdownMenuButton'>
              <dropdown-item v-on:toggle="updateUrl" v-for='country in countries' :key='country.code' v-bind='country'></dropdown-item>
            </ul>
          </div>
        </div>
      </div>

      <div class='form-group' v-if='isFrance'>
        <label class='col-xs-2 control-label' translate>Région</label>
        <div class='col-xs-10'>
          <div class='dropdown'>
            <button class='btn dropdown-toggle' type='button' data-toggle='dropdown'>
              {{ region.text }}
            </button>
            <ul class='dropdown-menu scrollable-menu' aria-labelledby='dropdownMenuButton'>
              <dropdown-item v-on:toggle="updateUrl" v-for='region in regions' :key='region.code' v-bind='region'></dropdown-item>
            </ul>
          </div>
        </div>
      </div>

    </div>

    <div id='memory-filters' class='row form-horizontal margin-bottom filters'>
      <div class='form-group'>
        <label class='col-xs-2 control-label' translate>Filtrer</label>
        <div class='col-xs-6'>
          <input type='text' class='form-control' :value='filter' @input='updateFilter'></input>
        </div>

        <label class='col-xs-2 control-label' translate>Nombre de résultats</label>
        <a class='col-xs-2 btn'>{{larps.length}}</a>
      </div>
    </div>

    <div id='results' class='row'>
      <table class='table table-striped'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Nom</th>
            <th>Organisation</th>
            <th>Pays</th>
            <th>Région</th>
          </tr>
        </thead>
        <tbody>
          <larp-line v-for='larp in larps' :key='larp.id' v-bind='larp'></larp-line>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script src='./root.js'></script>

<style>
.filters {
  border-radius: 4px;
  padding: 15px 15px 0px 15px;
  background-color: #f7f7f7;
}

.scrollable-menu {
  height: auto;
  max-height: 200px;
  overflow-x: hidden;
}
</style>
