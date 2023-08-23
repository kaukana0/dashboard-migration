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


mv ./components/chart/grid.mjs    ./components/chart/grid.js
mv ./components/chart/legend.mjs    ./components/chart/legend.js
mv ./components/chart/ticks/ticksAlt1.mjs    ./components/chart/ticks/ticksAlt1.js
mv ./components/chart/ticks/ticksAlt2.mjs    ./components/chart/ticks/ticksAlt2.js
mv ./components/chart/axis.mjs    ./components/chart/axis.js
mv ./components/chart/chart.mjs    ./components/chart/chart.js
mv ./components/chart/tooltip.mjs    ./components/chart/tooltip.js
mv ./components/processorCountryColors/countryColors.mjs    ./components/processorCountryColors/countryColors.js
mv ./components/chartCard/chartCard.mjs    ./components/chartCard/chartCard.js
mv ./components/chartCard/markUpCode.mjs    ./components/chartCard/markUpCode.js
mv ./components/pipeline/pipeline.mjs    ./components/pipeline/pipeline.js
mv ./components/util/util.mjs    ./components/util/util.js
mv ./components/multiDimAccess/multiDimAccess.mjs    ./components/multiDimAccess/multiDimAccess.js
mv ./components/multiDimAccess/tests.mjs    ./components/multiDimAccess/tests.js
mv ./components/multiDimAccess/visualizer.mjs    ./components/multiDimAccess/visualizer.js
mv ./components/eclLikeMenu/markUpCode.mjs    ./components/eclLikeMenu/markUpCode.js
mv ./components/eclLikeMenu/menu.mjs    ./components/eclLikeMenu/menu.js
mv ./components/eclLikeMessage/markUpCode.mjs    ./components/eclLikeMessage/markUpCode.js
mv ./components/eclLikeMessage/message.mjs    ./components/eclLikeMessage/message.js
mv ./components/select/select.mjs    ./components/select/select.js
mv ./components/select/markUpCode.mjs    ./components/select/markUpCode.js
mv ./components/eclLikeHeroBanner/heroBanner.mjs    ./components/eclLikeHeroBanner/heroBanner.js
mv ./components/eclLikeHeroBanner/markUpCode.mjs    ./components/eclLikeHeroBanner/markUpCode.js
mv ./components/buttonX/button.mjs    ./components/buttonX/button.js
mv ./components/buttonX/markUpCode.mjs    ./components/buttonX/markUpCode.js
mv ./components/range/range.mjs    ./components/range/range.js
mv ./components/processorCountryOrder/countryOrder.mjs    ./components/processorCountryOrder/countryOrder.js
mv ./js/main.mjs    ./js/main.js
mv ./js/model/pipelineProcessors/timeYearly.mjs    ./js/model/pipelineProcessors/timeYearly.js
mv ./js/model/pipelineProcessors/analyze.mjs    ./js/model/pipelineProcessors/analyze.js
mv ./js/model/pipelineProcessors/timeSeries.mjs    ./js/model/pipelineProcessors/timeSeries.js
mv ./js/model/pipelineProcessors/countrySeries.mjs    ./js/model/pipelineProcessors/countrySeries.js
mv ./js/model/pipelineProcessors/byOrder.mjs    ./js/model/pipelineProcessors/byOrder.js
mv ./js/model/cache.mjs    ./js/model/cache.js
mv ./js/model/cacheLs.mjs    ./js/model/cacheLs.js
mv ./js/model/fetcher.mjs    ./js/model/fetcher.js
mv ./js/model/common/textMappings.mjs    ./js/model/common/textMappings.js
mv ./js/model/common/groupDefinition.mjs    ./js/model/common/groupDefinition.js
mv ./js/model/common/codeMappings.mjs    ./js/model/common/codeMappings.js
mv ./js/model/common/byCode.mjs    ./js/model/common/byCode.js
mv ./js/model/common/euCode.mjs    ./js/model/common/euCode.js
mv ./js/model/url.mjs    ./js/model/url.js
mv ./js/view/modules/cards/cards.mjs    ./js/view/modules/cards/cards.js
mv ./js/view/modules/cards/markUpCode.mjs    ./js/view/modules/cards/markUpCode.js
mv ./js/view/modules/cards/range.mjs    ./js/view/modules/cards/range.js
mv ./js/view/modules/cards/tooltips/tooltipDotChart.mjs    ./js/view/modules/cards/tooltips/tooltipDotChart.js
mv ./js/view/modules/cards/tooltips/common.mjs    ./js/view/modules/cards/tooltips/common.js
mv ./js/view/modules/cards/tooltips/tooltipLineChartGC.mjs    ./js/view/modules/cards/tooltips/tooltipLineChartGC.js
mv ./js/view/modules/cards/tooltips/tooltipLineChartGB.mjs    ./js/view/modules/cards/tooltips/tooltipLineChartGB.js
mv ./js/view/modules/cards/tooltips/tooltipLineChart.mjs    ./js/view/modules/cards/tooltips/tooltipLineChart.js
mv ./js/view/modules/cards/tooltips/labelMapping.mjs    ./js/view/modules/cards/tooltips/labelMapping.js
mv ./js/view/modules/cards/subtitle.mjs    ./js/view/modules/cards/subtitle.js
mv ./js/view/modules/mainMenu.mjs    ./js/view/modules/mainMenu.js
mv ./js/view/modules/selects/selectBoxes.mjs    ./js/view/modules/selects/selectBoxes.js
mv ./js/view/modules/selects/bySelectConstraints.mjs    ./js/view/modules/selects/bySelectConstraints.js
mv ./js/view/modules/selects/geoSelect.mjs    ./js/view/modules/selects/geoSelect.js
mv ./js/view/modules/selects/commonConstraints.mjs    ./js/view/modules/selects/commonConstraints.js
mv ./js/view/modules/selects/bySelect.mjs    ./js/view/modules/selects/bySelect.js
mv ./js/view/modules/loadingIndicator.mjs    ./js/view/modules/loadingIndicator.js
mv ./js/view/modules/util.mjs    ./js/view/modules/util.js
mv ./js/view/view.mjs    ./js/view/view.js
mv ./js/common/magicStrings.mjs    ./js/common/magicStrings.js
mv ./redist/js-yaml.mjs    ./redist/js-yaml.js





# replace "mjs" with "js" in all the files containing mjs
# grep -i -r -l .mjs *

sed -i 's/\.mjs/\.js/'   components/chart/axis.js
sed -i 's/\.mjs/\.js/'   components/chart/chart.js
sed -i 's/\.mjs/\.js/'   components/chartCard/chartCard.js
sed -i 's/\.mjs/\.js/'   components/multiDimAccess/tests.js
sed -i 's/\.mjs/\.js/'   components/eclLikeMenu/menu.js
sed -i 's/\.mjs/\.js/'   components/eclLikeMessage/message.js
sed -i 's/\.mjs/\.js/'   components/select/select.js
sed -i 's/\.mjs/\.js/'   components/eclLikeHeroBanner/heroBanner.js
sed -i 's/\.mjs/\.js/'   components/buttonX/button.js
sed -i 's/\.mjs/\.js/'   index.html
sed -i 's/\.mjs/\.js/'   js/main.js
sed -i 's/\.mjs/\.js/'   js/model/pipelineProcessors/timeSeries.js
sed -i 's/\.mjs/\.js/'   js/model/pipelineProcessors/countrySeries.js
sed -i 's/\.mjs/\.js/'   js/model/fetcher.js
sed -i 's/\.mjs/\.js/'   js/model/common/textMappings.js
sed -i 's/\.mjs/\.js/'   js/model/common/codeMappings.js
sed -i 's/\.mjs/\.js/'   js/model/common/byCode.js
sed -i 's/\.mjs/\.js/'   js/model/common/euCode.js
sed -i 's/\.mjs/\.js/'   js/model/common/groupDefinition.js
sed -i 's/\.mjs/\.js/'   js/model/url.js
sed -i 's/\.mjs/\.js/'   js/view/modules/cards/cards.js
sed -i 's/\.mjs/\.js/'   js/view/modules/cards/tooltips/tooltipDotChart.js
sed -i 's/\.mjs/\.js/'   js/view/modules/cards/tooltips/common.js
sed -i 's/\.mjs/\.js/'   js/view/modules/cards/tooltips/tooltipLineChartGC.js
sed -i 's/\.mjs/\.js/'   js/view/modules/cards/tooltips/tooltipLineChartGB.js
sed -i 's/\.mjs/\.js/'   js/view/modules/cards/tooltips/tooltipLineChart.js
sed -i 's/\.mjs/\.js/'   js/view/modules/cards/tooltips/labelMapping.js
sed -i 's/\.mjs/\.js/'   js/view/modules/cards/subtitle.js
sed -i 's/\.mjs/\.js/'   js/view/modules/mainMenu.js
sed -i 's/\.mjs/\.js/'   js/view/modules/selects/selectBoxes.js
sed -i 's/\.mjs/\.js/'   js/view/modules/selects/bySelectConstraints.js
sed -i 's/\.mjs/\.js/'   js/view/modules/selects/geoSelect.js
sed -i 's/\.mjs/\.js/'   js/view/modules/selects/bySelect.js
sed -i 's/\.mjs/\.js/'   js/view/view.js
sed -i 's/\.mjs/\.js/'   js/common/magicStrings.js

cd ..

echo -e "\nDone.\n"
