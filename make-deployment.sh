#! /bin/bash

git rev-parse --short HEAD
read -p "Don't forget to put that into index.html - press enter to continue"

mkdir -p dist/
cd app/
rsync -av ./ ../dist/ --exclude=.git --exclude=*.md --exclude=*.txt
cd ..

# the following is only neccessary if server isn't configured to know what .mjs is
# find -name "*.mjs"

cd dist/

mv ./components/chart/grid.mjs  ./components/chart/grid.js
mv ./components/chart/legend.mjs  ./components/chart/legend.js
mv ./components/chart/ticks/ticksAlt1.mjs  ./components/chart/ticks/ticksAlt1.js
mv ./components/chart/ticks/ticksAlt2.mjs  ./components/chart/ticks/ticksAlt2.js
mv ./components/chart/tooltip.mjs  ./components/chart/tooltip.js
mv ./components/chart/axis.mjs  ./components/chart/axis.js
mv ./components/chart/chart.mjs  ./components/chart/chart.js
mv ./components/processorCountryColors/countryColors.mjs  ./components/processorCountryColors/countryColors.js
mv ./components/dropdownBox/markUpCode.mjs  ./components/dropdownBox/markUpCode.js
mv ./components/dropdownBox/dropdownBox.mjs  ./components/dropdownBox/dropdownBox.js
mv ./components/chartCard/chartCard.mjs  ./components/chartCard/chartCard.js
mv ./components/chartCard/markUpCode.mjs  ./components/chartCard/markUpCode.js
mv ./components/pipeline/pipeline.mjs  ./components/pipeline/pipeline.js
mv ./components/util/util.mjs  ./components/util/util.js
mv ./components/processorCountries/processor.mjs  ./components/processorCountries/processor.js
mv ./components/multiDimAccess/multiDimAccess.mjs  ./components/multiDimAccess/multiDimAccess.js
mv ./components/multiDimAccess/tests.mjs  ./components/multiDimAccess/tests.js
mv ./components/multiDimAccess/visualizer.mjs  ./components/multiDimAccess/visualizer.js
mv ./js/main.mjs  ./js/main.js
mv ./js/model/pipelineProcessors/timeYearly.mjs  ./js/model/pipelineProcessors/timeYearly.js
mv ./js/model/pipelineProcessors/analyze.mjs  ./js/model/pipelineProcessors/analyze.js
mv ./js/model/pipelineProcessors/common/key.mjs  ./js/model/pipelineProcessors/common/key.js
mv ./js/model/pipelineProcessors/common/metadataAccess.mjs  ./js/model/pipelineProcessors/common/metadataAccess.js
mv ./js/model/pipelineProcessors/timeSeries.mjs  ./js/model/pipelineProcessors/timeSeries.js
mv ./js/model/pipelineProcessors/countrySeries.mjs  ./js/model/pipelineProcessors/countrySeries.js
mv ./js/model/pipelineProcessors/timeSeriesLabels.mjs  ./js/model/pipelineProcessors/timeSeriesLabels.js
mv ./js/model/pipelineProcessors/countrySeriesLabels.mjs  ./js/model/pipelineProcessors/countrySeriesLabels.js
mv ./js/model/cache.mjs  ./js/model/cache.js
mv ./js/model/fetcher.mjs  ./js/model/fetcher.js
mv ./js/view/ui.mjs  ./js/view/ui.js
mv ./js/view/modules/cards/cards.mjs  ./js/view/modules/cards/cards.js
mv ./js/view/modules/cards/markUpCode.mjs  ./js/view/modules/cards/markUpCode.js
mv ./js/view/modules/dropDowns.mjs  ./js/view/modules/dropDowns.js
mv ./js/view/modules/mainMenu.mjs  ./js/view/modules/mainMenu.js
mv ./js/url.mjs  ./js/url.js
mv ./redist/jsonStat/import.mjs  ./redist/jsonStat/import.js
mv ./redist/lz-string.mjs  ./redist/lz-string.js
mv ./redist/js-yaml.mjs  ./redist/js-yaml.js


# replace "mjs" with "js" in all the files containing mjs
# grep -i -r -l .mjs *

sed -i 's/\.mjs/\.js/'  index.html
sed -i 's/\.mjs/\.js/'  components/chart/axis.js
sed -i 's/\.mjs/\.js/'  components/chart/chart.js
sed -i 's/\.mjs/\.js/'  components/dropdownBox/dropdownBox.js
sed -i 's/\.mjs/\.js/'  components/chartCard/chartCard.js
sed -i 's/\.mjs/\.js/'  components/multiDimAccess/tests.js
sed -i 's/\.mjs/\.js/'  index.hml
sed -i 's/\.mjs/\.js/'  js/main.js
sed -i 's/\.mjs/\.js/'  js/model/pipelineProcessors/timeSeries.js
sed -i 's/\.mjs/\.js/'  js/model/pipelineProcessors/countrySeries.js
sed -i 's/\.mjs/\.js/'  js/model/pipelineProcessors/timeSeriesLabels.js
sed -i 's/\.mjs/\.js/'  js/model/pipelineProcessors/countrySeriesLabels.js
sed -i 's/\.mjs/\.js/'  js/model/fetcher.js
sed -i 's/\.mjs/\.js/'  js/view/ui.js
sed -i 's/\.mjs/\.js/'  js/view/modules/cards/cards.js

cd ..

echo -e "\nDone.\n"
