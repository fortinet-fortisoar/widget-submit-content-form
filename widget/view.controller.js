/* Copyright start
MIT License
Copyright (c) 2023 Fortinet Inc
Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('communitySubmission100Ctrl', communitySubmission100Ctrl);

  communitySubmission100Ctrl.$inject = ['$scope', 'Upload', 'API', 'toaster', 'communitySubmissionService', 'markdownEditorService'];
  function communitySubmission100Ctrl($scope, Upload, API, toaster, communitySubmissionService, markdownEditorService) {

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
    $scope.selectedCategory = {
      name: ''
    };
    $scope.selectedSolution = {
      selectedSolution: ''
    }
    $scope.selectedCategoryChanged = selectedCategoryChanged;
    $scope.uploadFiles = uploadFiles;
    $scope.selectionChanged = selectionChanged;
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


    init();
    function init() {
      // getMdInstance();
      communitySubmissionService.getInstalledContent($scope).then(function (result) {
        $scope.createdContent = result;
      });
      // markdownEditorService.insertContent(mdEditorInstance, template);
    }

    function selectionChanged(){
      $scope.solutionDetails = 'Description:  \nDocuments Included: Yes/No ';

    }

    function selectedCategoryChanged(category){
      $scope.selectedCategory.name = category.name;
    }

    function uploadFiles(file) {
      // Filter out folders from the selected files
      $scope.playbookTriggered = true;

      if (file.size < 25072682) {
        if (file.type) {
          file.upload = Upload.upload({
            url: API.BASE + 'files',
            data: {
              file: file
            }
          });
          $scope.loadingJob = true;
          file.upload.then(function (response) {
            $scope.fileIRI = response.data;
            $scope.fileName = response.data.filename;
            $scope.loadingJob = false;
            $scope.uploadedFileFlag = true;
            $scope.playbookTriggered = false;
            if (!$scope.showCreatedSolutions) {
              communitySubmissionService.triggerPlaybook($scope);
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
              $scope.playbookTriggered = false;
              toaster.error({ body: message });
            });
        }
      }
      else {
        $scope.playbookTriggered = false;

        toaster.error({ body: 'File size exceeded limit, please try again' });
      }
    }

    function cancel() {
      delete $scope.playbookTriggered;
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
      const customModal = document.getElementById('custom-modal');
      $scope.nextPage = false;
      customModal.setAttribute('style', 'display:none;');
    }

    function submit() {
      if ($scope.communitySubmissionForm.$invalid) {
        $scope.communitySubmissionForm.$setTouched();
        $scope.communitySubmissionForm.$focusOnFirstError();
        return;
      }
      if (!$scope.showCreatedSolutions) {
        communitySubmissionService.exportSolution($scope.selectedSolution.selectedSolution, $scope);
      }
      else {
        communitySubmissionService.triggerPlaybook($scope);
      }
    }
  }
})();
