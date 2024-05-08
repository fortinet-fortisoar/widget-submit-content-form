/* Copyright start
MIT License
Copyright (c) 2024 Fortinet Inc
Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('submitContentForm100Ctrl', submitContentForm100Ctrl);

  submitContentForm100Ctrl.$inject = ['$scope', 'Upload', 'API', 'toaster', 'submitContentFormService', 'markdownEditorService'];
  function submitContentForm100Ctrl($scope, Upload, API, toaster, submitContentFormService, markdownEditorService) {

    $scope.category = [{ name: 'Connector', type: 'connector' }, { name: 'Solution Pack', type: 'solutionpack' }, { name: 'Widget', type: 'widget' }]
    $scope.user = {
      fullName: ''
    };
    $scope.user = {
      emailId: ''
    };
    $scope.user = {
      organizationName: ''
    };
    $scope.solutionDetails = 'Description:  \nDocuments Included: Yes/No ';
    $scope.user = {
      solutionTitle: ''
    };
    $scope.selectedCategory = { name: '' };
    $scope.selectedSolution = {
      selectedSolution: ''
    }
    $scope.minimize = minimize;
    // $scope.closeNote = closeNote;
    $scope.selectedCategoryChanged = selectedCategoryChanged;
    $scope.uploadFiles = uploadFiles;
    $scope.fileName = '';
    $scope.uploadedFileFlag = null;
    $scope.submit = submit;
    $scope.cancel = cancel;
    $scope.markdownConfig = {
      initialEditType: 'markdown', //wysiwyg/markdown
      previewStyle: 'tab',  //'vertical'
      height: '250px',
      usageStatistics: false,
      hideModeSwitch: true,
      toolbarItems: ['heading', 'bold', 'italic', 'strike', 'hr', 'divider', 'quote', 'ul', 'ol', 'indent',
        'outdent', 'divider', 'table', 'image', 'link', 'divider', 'code', 'codeblock'
      ]
    };
    $scope.moveToStep = moveToStep;

    $scope.showCreatedSolutions = 'created';
    $scope.currentStep = 1;
    // $scope.letsGetStarted = letsGetStarted;
    const maxFileSize = 25072682;

    init();
    function init() {
      submitContentFormService.getInstalledContent($scope).then(function (result) {
        $scope.createdContent = result;
      });
    }

    function selectedCategoryChanged(){
      $scope.uploadedFileFlag = null;
      $scope.selectedSolution.selectedSolution = null;
      if($scope.fileMetadata && $scope.fileMetadata.id){
        submitContentFormService.deleteFile(angular.copy($scope.fileMetadata.id));
        $scope.fileMetadata = null;
      }
      $scope.fileName = null;
    }


    // function letsGetStarted(){
    //   $scope.currentStep = 2;
    // }


    function uploadFiles(file) {
      // Filter out folders from the selected files
      $scope.enableSpinner = true;
      if (file.size < maxFileSize) {
        if (file.type) {
          file.upload = Upload.upload({
            url: API.BASE + 'files',
            data: {
              file: file
            }
          });
          $scope.loadingJob = true;
          file.upload.then(function (response) {
            $scope.fileMetadata = response.data;
            $scope.fileName = response.data.filename;
            $scope.loadingJob = false;
            $scope.uploadedFileFlag = true;
            $scope.enableSpinner = false;
            if ($scope.showCreatedSolutions === 'created') {
              submitContentFormService.triggerPlaybook($scope);
            }
          },
            function (response) {
              $scope.loadingJob = false;
              if (response.status > 0) {
                $log.debug(response.status + ': ' + response.data);
              }
              var message = 'Upload failed. Please try again.';
              if (response.status === 413) {
                message = 'File exceeds the maximum size.';
              }
              $scope.enableSpinner = false;
              toaster.error({ body: message });
            });
        }
      }
      else {
        $scope.enableSpinner = false;
        toaster.error({ body: 'File size exceeded limit, please try again' });
      }
    }

    // function closeNote() {
    //   var disclaimerBox = document.getElementById('disclaimer-box');
    //   disclaimerBox.remove();
    //   var formDetails = document.getElementById('community-details-form');
    //   formDetails.setAttribute('style', 'margin-top: 0px; height: 865px;');
    // }


    function minimize(){
      const customModal = document.getElementById('custom-modal');
      customModal.setAttribute('style', 'display:none;');
      $scope.submitContentFormForm.$setPristine();
      $scope.submitContentFormForm.$setUntouched();
    }

    function moveToStep(stepNumber){
      if( $scope.currentStep != 3)
      {$scope.currentStep = stepNumber;}
    }

    function cancel() {
      delete $scope.submitFormFlag;
      delete $scope.uploadedFile;
      delete $scope.user.fullName
      delete $scope.user.emailId;
      $scope.user = {
        organizationName: ''
      };
      $scope.solutionDetails = '';
      $scope.user = {
        solutionTitle: ''
      };
      $scope.uploadedFileFlag = null;
      $scope.selectedSolution.selectedSolution = '';
      $scope.currentStep = 1;
      const customModal = document.getElementById('custom-modal');
      customModal.setAttribute('style', 'display:none;');
      $scope.submitContentFormForm.$setPristine();
      $scope.submitContentFormForm.$setUntouched();
    }


    function submit() {
      if ($scope.submitContentFormForm.$invalid) {
        $scope.submitContentFormForm.$setTouched();
        $scope.submitContentFormForm.$focusOnFirstError();
        return;
      }
      $scope.submitFormFlag = true;
      if ($scope.showCreatedSolutions === 'created') {
        $scope.selectedSolution.selectedSolution = JSON.parse($scope.selectedSolution.selectedSolution);
        submitContentFormService.exportSolution(angular.copy($scope.selectedSolution.selectedSolution), $scope);
      }
      else {
        submitContentFormService.triggerPlaybook($scope);
      }
    }
  }
})();
