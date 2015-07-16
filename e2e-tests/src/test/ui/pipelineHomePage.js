describe('StreamSets Data Collector App', function() {

  beforeEach(function() {
    browser.ignoreSynchronization = true;
    //browser.manage().timeouts().pageLoadTimeout(10000);
  });

  afterEach(function() {
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
  });

  browser.get('/');

  it('should automatically redirect to / when location fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/");
  });


  describe('Pipeline home page', function() {

    it('should show create pipeline button when pipeline list is empty', function() {
      browser.get('/');

      element.all(by.repeater('pipeline in pipelines')).then(function(pipelines) {
        expect(pipelines.length).toEqual(0);
      });

      element.all(by.css('.create-pipeline-btn')).then(function(elements) {
        var createBtnElement = elements[elements.length - 1];
        createBtnElement.isDisplayed().then(function (isVisible) {
          expect(isVisible).toBeTruthy();
        });
      });

      element.all(by.css('.import-pipeline-btn')).then(function(elements) {
        var importBtnElement = elements[elements.length - 1];
        importBtnElement.isDisplayed().then(function (isVisible) {
          expect(isVisible).toBeTruthy();
        });
      });
    });

    it('should be able to import pipeline', function() {
      browser.get('/');
      browser.sleep(1000);
      element.all(by.css('.import-pipeline-btn')).then(function(elements) {
        var importBtnElement = elements[elements.length - 1];
        importBtnElement.click();

        browser.sleep(1500);

        element(by.css('input[type="file"]')).sendKeys(__dirname + '/testData/testPipeline.json');

        browser.sleep(1500);

        element(by.model('newConfig.name')).sendKeys('UI End to End Test Pipeline');
        element(by.css('button[type="submit"]')).click();

        browser.sleep(1500);

        //Toggle Library Pane
        element(by.css('[ng-click="toggleLibraryPanel()"]')).click();

        //Test pipeline creation by checking list of pipelines
        element.all(by.repeater('pipeline in pipelines')).then(function(pipelines) {
          expect(pipelines.length).toEqual(1);
          expect(pipelines[0].element(by.binding('pipeline.name')).getText()).toEqual('UI End to End Test Pipeline');
        });

      });
    });


    it('should be able to create new pipeline', function() {
      browser.get('/collector/pipeline/UI%20End%20to%20End%20Test%20Pipeline');
      browser.sleep(1000);
      element(by.css('[ng-click="toggleLibraryPanel()"]')).click();

      element.all(by.css('.create-pipeline-btn')).then(function(elements) {
        var createBtnElement = elements[0];
        createBtnElement.click();

        //Fill Create Pipeline Modal Dialog values
        element(by.model('newConfig.name')).sendKeys('Sample Pipeline');
        element(by.model('newConfig.description')).sendKeys('pipeline description');
        element(by.css('button[type="submit"]')).click();

        browser.sleep(1000);

        element(by.css('[ng-click="toggleLibraryPanel()"]')).click();

        //Test pipeline creation by checking list of pipelines
        element.all(by.repeater('pipeline in pipelines')).then(function(pipelines) {
          expect(pipelines.length).toEqual(2);
          expect(pipelines[0].element(by.binding('pipeline.name')).getText()).toEqual('Sample Pipeline');
        });

      });
    });


    it('should be able to duplicate pipeline', function() {
      browser.get('/collector/pipeline/Sample Pipeline');
      browser.sleep(500);
      //Toggle Library Pane
      element(by.css('[ng-click="toggleLibraryPanel()"]')).click();

      element.all(by.repeater('pipeline in pipelines')).then(function(pipelines) {

        pipelines[0].element(by.css('.dropdown-toggle')).click();

        pipelines[0].element(by.css('[ng-click="duplicatePipelineConfig(pipeline, $event)"]')).click();

        browser.sleep(500);

        element(by.css('.duplicate-modal-form')).element(by.css('button[type="submit"]')).click();

        browser.sleep(2000);

        element(by.css('[ng-click="toggleLibraryPanel()"]')).click();

        //Test pipeline creation by checking list of pipelines
        element.all(by.repeater('pipeline in pipelines')).then(function(pipelines) {
          expect(pipelines.length).toEqual(3);
          expect(pipelines[1].element(by.binding('pipeline.name')).getText()).toEqual('Sample Pipelinecopy');
        });

      });
    });


    it('should be able to delete pipeline', function() {
      browser.get('/collector/pipeline/Sample Pipeline');
      browser.sleep(1000);
      //Toggle Library Pane
      element(by.css('[ng-click="toggleLibraryPanel()"]')).click();

      element.all(by.repeater('pipeline in pipelines')).then(function(pipelines) {

        //Select 2 pipeline
        pipelines[1].click();

        browser.sleep(1000);

        element(by.css('[ng-click="toggleLibraryPanel()"]')).click();

        element.all(by.repeater('pipeline in pipelines')).then(function(pipelines) {
          //Click dropdown toggle icon
          pipelines[1].element(by.css('.dropdown-toggle')).click();

          //Click Delete button in dropdown
          pipelines[1].element(by.css('[ng-click="deletePipelineConfig(pipeline, $event)"]')).click();


          //Click yes button
          element(by.css('[ng-click="yes()"]')).click();


          browser.sleep(1500);

          element(by.css('[ng-click="toggleLibraryPanel()"]')).click();

          //Test pipeline deletion by checking list of pipelines
          element.all(by.repeater('pipeline in pipelines')).then(function(pipelines) {
            expect(pipelines.length).toEqual(2);
          });
        });

      });
    });

    it('should be able to toggle stage library and click on stage to add', function() {
      browser.get('/collector/pipeline/Sample Pipeline');
      browser.sleep(1000);
      //Select Sample Pipeline

      //Toggle Library Pane
      element(by.css('[ng-click="toggleLibraryPanel()"]')).click();

      element.all(by.repeater('pipeline in pipelines')).then(function(pipelines) {

        //browser.wait(pipelines[0].isPresent);

        //Select 1 pipeline
        //pipelines[0].click();



        element(by.css('[ng-click="toggleLibraryPanel()"]')).click();
      });

      element(by.css('[ng-click="$storage.hideStageLibraryPanel = !$storage.hideStageLibraryPanel"]')).click();
      expect(element(by.model('$storage.stageFilterGroup')).getAttribute('value')).toEqual('SOURCE');

      //Add Source
      element.all(by.repeater('stageLibrary in filteredStageLibraries')).then(function(stageLibraries) {
        //Select 1 Stage
        stageLibraries[0].click();

        browser.sleep(2000);
      });


      //Add Processor
      element(by.model('$storage.stageFilterGroup')).element(by.cssContainingText('option', 'Processor')).click();
      element.all(by.repeater('stageLibrary in filteredStageLibraries')).then(function(stageLibraries) {
        //Select 1 Stage
        stageLibraries[0].click();
        browser.sleep(2000);
      });


      //Add Target
      element(by.model('$storage.stageFilterGroup')).element(by.cssContainingText('option', 'Destinations')).click();
      element.all(by.repeater('stageLibrary in filteredStageLibraries')).then(function(stageLibraries) {
        //Select 1 Stage
        stageLibraries[0].click();
        browser.sleep(2000);
      });

    });

  });
});