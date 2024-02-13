/* Copyright start
MIT License
Copyright (c) 2023 Fortinet Inc
Copyright end */
  'use strict';
  (function () {
      angular
          .module('cybersponse')
          .controller('editCommunitySubmission100Ctrl', editCommunitySubmission100Ctrl);
  
      editCommunitySubmission100Ctrl.$inject = ['$scope', '$uibModalInstance', 'config'];
  
      function editCommunitySubmission100Ctrl($scope, $uibModalInstance, config) {
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
  