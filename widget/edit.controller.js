/* Copyright start
MIT License
Copyright (c) 2024 Fortinet Inc
Copyright end */
  'use strict';
  (function () {
      angular
          .module('cybersponse')
          .controller('editSubmitContentForm100Ctrl', editSubmitContentForm100Ctrl);
  
      editSubmitContentForm100Ctrl.$inject = ['$scope', '$uibModalInstance', 'config'];
  
      function editSubmitContentForm100Ctrl($scope, $uibModalInstance, config) {
          $scope.cancel = cancel;
          $scope.save = save;
          $scope.config = config;
  
          function cancel() {
              $uibModalInstance.dismiss('cancel');
          }
  
          function save() {
              $uibModalInstance.close($scope.config);
          }
  
      }
  })();
  