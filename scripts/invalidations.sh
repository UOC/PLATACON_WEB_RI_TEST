max_retries=5
minutes_delay_retry=1
invalidation_files=("invalidation-batch-1.json" "invalidation-batch-2.json")

# Función para verificar si hay invalidaciones en progreso
function check_invalidations_in_progress() {
    invalidations=$(aws cloudfront list-invalidations --distribution-id "$DISTRIBUTION_ID" --query 'InvalidationList.Items[?Status==`InProgress`].Id' --output text)
    if [[ -z "$invalidations" ]]; then
        return 1  # No hay invalidaciones en progreso
    else
        return 0  # Hay invalidaciones en progreso
    fi
}

function create_invalidation() {
    local paths_file=$1
    aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --invalidation-batch "file://scripts/data/$paths_file"
    echo "Se ha lanzado una nueva invalidación para el archivo: $paths_file."
}

# Iterar sobre cada archivo de invalidación
for invalidation_file in "${invalidation_files[@]}"; do
    echo "Procesando archivo de invalidación: $invalidation_file"
    retries=1

    # Verificar si hay invalidaciones en progreso antes de continuar con la invalidación actual
    while check_invalidations_in_progress; do
        if ((retries > max_retries)); then
            echo "Se ha alcanzado el máximo de reintentos. No se lanzará una nueva invalidación para el archivo: $invalidation_file."
            exit 1
        fi

        echo "Hay invalidaciones en progreso. Esperando a que se completen... Intento ${retries} de ${max_retries}"
        sleep $(($minutes_delay_retry * 60))  # Esperar $minutes_delay_retry minutos antes de verificar nuevamente
        ((retries++))
    done

    # No hay invalidaciones en progreso, crear una nueva invalidación para el archivo actual
    create_invalidation "$invalidation_file"
done

# Si se ha procesado correctamente toda la lista de archivos de invalidación
echo "Todas las invalidaciones se han lanzado con éxito."
