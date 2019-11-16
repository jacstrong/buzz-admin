echo "${STAGE}"
echo "${DEV}"


if [[ -v DEV ]]; then
    echo "Building in develop"
    npx vue-cli-service build --mode dev
else
    if [[ -v STAGE ]]; then
        echo "Stage is set"
        echo "Building admin for stage."
        npx vue-cli-service build --mode stage
    else
        echo "Building admin for production."
        npx vue-cli-service build
    fi
fi
