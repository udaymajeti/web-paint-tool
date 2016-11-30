# web-paint-tool
Paint tool


First of all both backend and front end folders must be in same directory to run this project.

1) Import gradle project (back end) using the import wizard via (File ▸ Import…▸ Gradle ▸ Gradle Project) menu entry.

2) After pressing the Next button, you need to specify the root directory of your Gradle project.

3)You may now press Build Model button and wait until the projet gets build and then select the required project from the options and 
press finish to complete the importing the project.

4) After successfully importing a Gradle project,
 to run the project- edit the settings in runtime configurations by mentioning required main class(application.EpidemicPaint) of the 
 project and also mention program arguments (server app_config.yml) in Arguments section and then click run to execute the project.

5) Once if server gets started, open the web browser and go to http://localhost:8080 to get the image which has been already saved.

6) Now, we can have paint tool in our broswer with the following features:
--A pen with adjustable thickness and colour.
--Redo and undo of actions.
--Export and import of images.
--A service that persist the web clients drawings.
