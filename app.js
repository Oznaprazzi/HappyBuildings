var app = angular.module('plunker', []);

app.controller('MainCtrl', function($scope, $http) {
  	$scope.userlist = "user_list.json";
  	$scope.buildingdir = "building_dir.json";

  	$scope.projects = [];
  	$scope.projectstatus = ['done', 'on-going', 'closed'];
  	
  	  $http.get($scope.userlist)	
				.then(function sucessCall(response)	{		
					$scope.users	=	response.data.users;
				},function errorCall()	{	
						alert("Error reading users list.");	
				}	
			);
			$http.get($scope.buildingdir)	
				.then(function sucessCall(response)	{		
					$scope.buildings	=	response.data.buildings;
				},function errorCall()	{	
						alert("Error reading building directory.");	
				}	
			);
		
  $scope.view = 1;
  $scope.backOn = 0;
  $scope.bdOn = 0;
  
  $scope.password = "";
  
  //Visibility
  $scope.showNav=function(){
    $scope.nav = !$scope.nav;
  };
  
  $scope.setBackOn=function(on){
    $scope.backOn = on;
  };
  
  $scope.isBackOn=function(on){
    return $scope.backOn == on;
  };
  
  $scope.setBdOn=function(on){
    $scope.bdOn = on;
  };
  
  $scope.isBdOn=function(on){
    return $scope.bdOn == on;
  };
  
  $scope.setView=function(view){
    $scope.view = view;
  };
  
   $scope.isView=function(view){
    if($scope.view == 1){
      $scope.setBackOn(0);
    }
    return $scope.view == view;
  };
  
  //Back
  $scope.back=function(){
    if($scope.view == 2){
      $scope.setView(1);
      $scope.showNav();
      $scope.selectedBldg = [];
    }else if($scope.view == 3 || $scope.view == 7){
      $scope.setBackOn(0);
      $scope.setView(2);
    }else if($scope.view == 4){
      $scope.setView(3);
    }else if($scope.view == 6){
      $scope.setView(3);
    }
  };
  if($scope.view == 5){
      $scope.setBdOn(1);
    }else{
      $scope.setBdOn(2);
    }
    
  //Logout
  $scope.logout=function(){
    $scope.setView(1);
    $scope.showNav();
    $scope.setBdOn(2);
  };
  
  //Login
  $scope.verifyLogin=function(){
    if($scope.username == "" && $scope.password == ""){
       $scope.print="Please input a valid username and password";
    }else if($scope.username == "" && $scope.password != ""){
      $scope.print="Please input a valid username";
    }else if($scope.password == ""){
      $scope.print="Please input a valid password";
    }else{
      $scope.validUsername = false;
      $scope.validPassword = false;
      var userIndex = -1;
      for (i=0; i < $scope.users.length; i++) {
        if ($scope.users[i].LoginName == $scope.username) { 
          $scope.validUsername = true;
          $scope.currentUser = $scope.users[i];
          userIndex = i;
          break;
        }
      }
      if ($scope.users[userIndex].Password == $scope.password) { 
        $scope.validPassword = true;
      }
      if ($scope.validUsername && $scope.validPassword) {
        $scope.setView(2);
        $scope.showNav();
        $scope.cancelLogin();
      }else{
        $scope.print = "Incorrect username or password";
      }
    }
    
  };
  
   $scope.cancelLogin=function(){
    $scope.print="";
    $scope.username="";
    $scope.password="";
  };
  
  //Stores the selected building's id
  $scope.bldgID = -1;
  
  //Building Directory
  $scope.viewInfo=function(index){
    //Stores the current building's associated projects
    $scope.bldgprojects = [];
    
    //Stores the selected building
    $scope.selectedBldg = $scope.buildings[index];
    
    $scope.bldgID = $scope.selectedBldg.ID;
    for(i = 0; i < $scope.projects.length; i++){
      if($scope.projects[i].BuildingID == $scope.bldgID){
        $scope.bldgprojects.push($scope.projects[i]);
        $scope.printMessage("projects");
      }
    }
    $scope.printMessage("projects");
    
    $scope.setBackOn(1);
    $scope.setView(3);
  };
  
  //Archived Projects
  $scope.bd=function(){
    $scope.setView(2);
    $scope.setBdOn(2);
  };
  
  //Stores the archived projects
  $scope.archdprojects = [];
  
  //Building Information
  $scope.viewDetails=function(index){
    //Stores the selected project
    $scope.selectedProj = $scope.bldgprojects[index];
    $scope.setBackOn(1);
    $scope.setView(4);
  };
  
  //Archived Projects
  $scope.archivedProjects=function(){
    $scope.setView(5);
    $scope.setBdOn(1);
    $scope.setBackOn(0);
  };
  
  $scope.archiveProj=function(proj){
    var index = $scope.bldgprojects.indexOf(proj);
    $scope.bldgprojects.splice(index, 1);
    index = $scope.projects.indexOf(proj);
    $scope.projects.splice(index, 1);
    $scope.archdprojects.push(proj);
  };
  
  //Unarchive a project
  $scope.unarchiveProj=function(proj){
    var index = $scope.archdprojects.indexOf(proj);
    $scope.archdprojects.splice(index, 1);
    $scope.projects.push(proj);
  };
  
  //Delete any project
  $scope.deleteProj=function(proj){
    var index; 
    if($scope.view == 5){
      index = $scope.archdprojects.indexOf(proj);
      $scope.archdprojects.splice(index, 1);
    }else{
      index = $scope.bldgprojects.indexOf(proj);
      $scope.bldgprojects.splice(index, 1);
      index = $scope.projects.indexOf(proj);
      $scope.projects.splice(index, 1);
    }
  };
  
  //Project Details
  $scope.projectDeatils=function(proj){
    $scope.typeOfWork = ""; //Initialises work information
    $scope.workStatus = "";
    if(proj!=null){
      $scope.projName = proj.Name;
      $scope.projStatus = proj.Status;
      $scope.projStrtDate = proj.StartDate;
      $scope.projEndDate = proj.EndDate;
      $scope.projPerson = proj.ContactPerson;
      $scope.projManager = proj.ProjectManager;
      $scope.projContractor = proj.Contractor;
      $scope.works = proj.Works;
    }else{
      $scope.projName = null;
      $scope.projStrtDate = null;
      $scope.projEndDate = null;
      $scope.projPerson = null;
      $scope.projManager = null;
      $scope.projContractor = null;
      $scope.works = [];
    }
  };
  
  $scope.setBuildingData=function(building){
    if(building != null){
      $scope.owner = building.Owner;
      $scope.address = building.Address;
      $scope.buildingType = building.BuildingType;
      
      var year;
      var month;
      var day;
      var hour;
      var min;
    
      if(angular.isObject(building.ConstructionDate)){
        $scope.constructionDate = building.ConstructionDate;
      }else{
        year = parseInt(building.ConstructionDate.slice(0,4));
        month = parseInt(building.ConstructionDate.slice(5,7));
        day = parseInt(building.ConstructionDate.slice(8,10));
        hour = parseInt(building.ConstructionDate.slice(11,13));
        min = parseInt(building.ConstructionDate.slice(14,16));
        $scope.constructionDate = new Date(year, month, day, hour, min);
      }
    }else{
      $scope.owner = null;
      $scope.address = null;
      $scope.buildingType = null;
      $scope.constructionDate = null;
    }
  };

  $scope.printMessage = function(table){
    if(table == "comments"){
      if($scope.selectedProj.Comments.length == 0){
        return "There are no comments for this project.";
      }else{
        return "";
      }
    }else if(table == "works"){
      if($scope.selectedProj.Works.length == 0){
        return "There are no works for this project.";
      }else{
        return "";
      }
    }else if(table == "projects"){
      if($scope.bldgprojects.length == 0){
        return "There are no projects for this building yet.";
      }else{
        return "";
      }
    }else if(table == "archives"){
      if($scope.archdprojects.length == 0){
        return "There are no archived projects yet.";
      }else{
        return "";
      }
    }
  };
  
  $scope.validDates=function(datetimeEnd, datetimeStart){
    if(Date.parse(datetimeStart) < Date.parse(datetimeEnd)){
       return true;
    }else{
       return false;
    }
  };
  
  //Determines whether the Add project button was pressed.
  var edit;
  $scope.edit=function(bool){
    if(bool){
      $scope.projectDeatils(null);
    }else{
      $scope.projectDeatils($scope.selectedProj);
    }
    edit = bool;
    $scope.setView(6);
  };
  
  var editB; //Determines if buidling is being edited
  $scope.editBuildingInfo=function(pressed){
    if(pressed){
      $scope.setBuildingData($scope.selectedBldg);
    }else{
      $scope.setBuildingData(null);
    }
    editB = pressed;
    $scope.setView(7);
    $scope.setBackOn(1);
  };
  
  //Add Work to project
  $scope.addWorks=function(){
    if($scope.typeOfWork == null || $scope.workStatus == null){
      alert("Please fill in all work data fields");
      return;
    }
    var work = {};
    work.TypeOfWork = $scope.typeOfWork;
    work.Status = $scope.workStatus;
    $scope.works.push(work);
    $scope.typeOfWork = "";
    $scope.workStatus = "";
  };
  
  //Comments Section

  //add a comment to a project
  $scope.addComment=function(){
    if($scope.projectcomment === ""){
      alert("Please enter some text into the comment box.");
      return;
    }
    var comments = {};
    comments.Author = $scope.currentUser.LoginName;
    comments.Text = $scope.projectcomment;
    $scope.selectedProj.Comments.push(comments);
    $scope.projectcomment = "";
  };
  
  $scope.cancelcomment=function(){
    $scope.projectcomment="";
  };
  
  /**
   * Delete method for deleting an existing comment. 
   * 
  */
  $scope.deleteComment=function(index){
    $scope.selectedProj.Comments.splice(index, 1);
  };
  
  //Updates or saves project
  $scope.update=function(proj){
    if(!edit){
      for(i = 0; i < $scope.projects.length; i++){
        if($scope.projects[i].ProjectID == proj.ProjectID){ //if project already exists
          $scope.projects[i] = proj; //replace with new project information
        }
      }
      for(i = 0; i < $scope.bldgprojects.length; i++){
        if($scope.bldgprojects[i].ProjectID == proj.ProjectID){
          $scope.bldgprojects[i] = proj;
        }
      }
      return false;
    }
    $scope.bldgprojects.push(proj);
    $scope.projects.push(proj);
    return true;
  };
  
  $scope.updateBuildingInfo = function(building){
    if(editB){
      for(i = 0; i < $scope.buildings.length; i++){
        if($scope.buildings[i].ID == building.ID){ //if building already exists
          $scope.buildings[i] = building; //replace with new building information
        }
      }
      return true;
    }
    $scope.buildings.push(building);
    return false;
  };
  
  //Creates project object
  $scope.createProj=function(){
    var project = {};
    if(edit){
      project.ProjectID = $scope.projects.length+1;
      project.Comments = [];
    }else{
      project.ProjectID = $scope.selectedProj.ProjectID;
       project.Comments = $scope.selectedProj.Comments;
    }
    project.Name = $scope.projName;
    project.BuildingID = $scope.bldgID;
    project.Status = $scope.projStatus;
    project.StartDate = new Date($scope.projStrtDate);
    project.EndDate = new Date($scope.projEndDate);
    project.ContactPerson = $scope.projPerson;
    project.ProjectManager = $scope.projManager;
    project.Contractor = $scope.projContractor;
    project.Works = $scope.works;
    
    return project;
  };
  
  //creates a new building object
  $scope.createBuilding=function(){
    var building = {}; //initialize empty building
    if(!editB){
      building.ID = $scope.buildings.length+1;
      for(i = 0; i < $scope.buildings.length; i++){
        if(building.ID == $scope.buildings[i].ID){ //Checks if new building has the same id as an existing building
          building.ID++;                           // If it is, then increment the new buildingID number
        }
      }
    }else{
      building.ID = $scope.selectedBldg.ID;
    }
    building.Owner = $scope.owner;
    building.Address = $scope.address;
    building.BuildingType = $scope.buildingType;
    building.ConstructionDate = new Date($scope.constructionDate);
    
    return building;
  };
  
  //Cancels a project edit
  $scope.cancelProj=function(){
    alert("Cancelled Project Edit.");
    $scope.setView(3);
  };
  
  //Cancels a building edit
  $scope.cancelBuildingInfo=function(){
    alert("Cancelled Building Edit.");
    $scope.setBackOn(0);
    $scope.setView(2);
  };
  
  //Saves Building Information
  $scope.saveBuildingInfo=function(){
    if($scope.owner == null || $scope.address == null || $scope.buildingType == null || $scope.constructionDate == null ){
      alert("Error: Please fill in all fields.");
    }else{
      var building = $scope.createBuilding();
      var updated = $scope.updateBuildingInfo(building);
      $http.post("https://happybuildings.sim.vuw.ac.nz/api/golinu/update.building.json", building)	
  			.then(function sucessCall(response)	{	
  			  if(!updated){
  				  alert("Project successfully added!");
  			  }else{
  			    alert("Project successfully updated!");
  			  }
  			},function errorCall(){	
  				alert("Something went wrong with the server. Please try again later.");	
  			}	
  		);
    
      $scope.owner = null;
      $scope.address = null;
      $scope.buildingType = null;
      $scope.constructionDate = null;
      
      $scope.setView(2);
    }
  };
  
  //Saves edited/new project
  $scope.save=function(){
    if($scope.projName == null || $scope.projStatus == null || $scope.projStrtDate == null || $scope.projEndDate == null || $scope.projPerson == null || $scope.projManager == null || $scope.projContractor == null){
      alert("Error: Please fill in all fields.");
    }else if(!$scope.validDates($scope.projEndDate, $scope.projStrtDate)){
      alert("Error: Start date is later than End date");
    }else{
      var project = $scope.createProj();
      var updated = $scope.update(project);
      $http.post("https://happybuildings.sim.vuw.ac.nz/api/golinu/update.project.json",project)	
  			.then(function sucessCall(response)	{	
  			  if(updated){
  				  alert("Project successfully added!");
  			  }else{
  			    alert("Project successfully updated!");
  			  }
  			},function errorCall(){	
  				alert("Something went wrong with the server. Please try again later.");	
  			}	
  		);
  			
      $scope.projName = null;
      $scope.projStatus = null;
      $scope.projStrtDate = null;
      $scope.projEndDate = null;
      $scope.projPerson = null;
      $scope.projManager = null;
      $scope.projContractor = null;
      
      $scope.setView(3);
    }
  };
  
  //Determines whether a manager is logged in for authorisation of accessing different functionalities
  $scope.isManager=function(){
    if($scope.currentUser.UserType == "manager"){
      return true;
    }
    return false;
  };
});
