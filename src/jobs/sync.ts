import cron from 'node-cron';
import CharacterService from '../services/CharacterService';
import LocationService from '../services/LocationService';
import EpisodeService from '../services/EpisodeService';

/**
 * Cron job que corre cada 12 horas para sincronizar datos
 */
cron.schedule('0 */12 * * *', async () => {
  console.log(new Date().toISOString(), '[Cron] Iniciando sincronización de Rick & Morty');
  try {
    console.log('🔁 1. Sincronizando Locations...');
    await LocationService.syncLocations();

    console.log('🔁 2. Sincronizando Episodes...');
    await EpisodeService.syncEpisodes();

    console.log('🔁 3. Sincronizando Characters...');
    await CharacterService.syncCharacters();
    
    console.log(new Date().toISOString(), '[Cron] Sincronización completada exitosamente');
  } catch (error) {
    console.error(new Date().toISOString(), '[Cron] Error durante sincronización:', error);
  }
});