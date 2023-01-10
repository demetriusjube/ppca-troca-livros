package br.unb.ppca.trocalivros.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.unb.ppca.trocalivros.IntegrationTest;
import br.unb.ppca.trocalivros.domain.Troca;
import br.unb.ppca.trocalivros.repository.TrocaRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link TrocaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TrocaResourceIT {

    private static final Instant DEFAULT_DATA_INICIO = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATA_INICIO = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATA_FIM = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATA_FIM = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_RESULTADO = "AAAAAAAAAA";
    private static final String UPDATED_RESULTADO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/trocas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TrocaRepository trocaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTrocaMockMvc;

    private Troca troca;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Troca createEntity(EntityManager em) {
        Troca troca = new Troca().dataInicio(DEFAULT_DATA_INICIO).dataFim(DEFAULT_DATA_FIM).resultado(DEFAULT_RESULTADO);
        return troca;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Troca createUpdatedEntity(EntityManager em) {
        Troca troca = new Troca().dataInicio(UPDATED_DATA_INICIO).dataFim(UPDATED_DATA_FIM).resultado(UPDATED_RESULTADO);
        return troca;
    }

    @BeforeEach
    public void initTest() {
        troca = createEntity(em);
    }

    @Test
    @Transactional
    void createTroca() throws Exception {
        int databaseSizeBeforeCreate = trocaRepository.findAll().size();
        // Create the Troca
        restTrocaMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(troca))
            )
            .andExpect(status().isCreated());

        // Validate the Troca in the database
        List<Troca> trocaList = trocaRepository.findAll();
        assertThat(trocaList).hasSize(databaseSizeBeforeCreate + 1);
        Troca testTroca = trocaList.get(trocaList.size() - 1);
        assertThat(testTroca.getDataInicio()).isEqualTo(DEFAULT_DATA_INICIO);
        assertThat(testTroca.getDataFim()).isEqualTo(DEFAULT_DATA_FIM);
        assertThat(testTroca.getResultado()).isEqualTo(DEFAULT_RESULTADO);
    }

    @Test
    @Transactional
    void createTrocaWithExistingId() throws Exception {
        // Create the Troca with an existing ID
        troca.setId(1L);

        int databaseSizeBeforeCreate = trocaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTrocaMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(troca))
            )
            .andExpect(status().isBadRequest());

        // Validate the Troca in the database
        List<Troca> trocaList = trocaRepository.findAll();
        assertThat(trocaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTrocas() throws Exception {
        // Initialize the database
        trocaRepository.saveAndFlush(troca);

        // Get all the trocaList
        restTrocaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(troca.getId().intValue())))
            .andExpect(jsonPath("$.[*].dataInicio").value(hasItem(DEFAULT_DATA_INICIO.toString())))
            .andExpect(jsonPath("$.[*].dataFim").value(hasItem(DEFAULT_DATA_FIM.toString())))
            .andExpect(jsonPath("$.[*].resultado").value(hasItem(DEFAULT_RESULTADO.toString())));
    }

    @Test
    @Transactional
    void getTroca() throws Exception {
        // Initialize the database
        trocaRepository.saveAndFlush(troca);

        // Get the troca
        restTrocaMockMvc
            .perform(get(ENTITY_API_URL_ID, troca.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(troca.getId().intValue()))
            .andExpect(jsonPath("$.dataInicio").value(DEFAULT_DATA_INICIO.toString()))
            .andExpect(jsonPath("$.dataFim").value(DEFAULT_DATA_FIM.toString()))
            .andExpect(jsonPath("$.resultado").value(DEFAULT_RESULTADO.toString()));
    }

    @Test
    @Transactional
    void getNonExistingTroca() throws Exception {
        // Get the troca
        restTrocaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTroca() throws Exception {
        // Initialize the database
        trocaRepository.saveAndFlush(troca);

        int databaseSizeBeforeUpdate = trocaRepository.findAll().size();

        // Update the troca
        Troca updatedTroca = trocaRepository.findById(troca.getId()).get();
        // Disconnect from session so that the updates on updatedTroca are not directly saved in db
        em.detach(updatedTroca);
        updatedTroca.dataInicio(UPDATED_DATA_INICIO).dataFim(UPDATED_DATA_FIM).resultado(UPDATED_RESULTADO);

        restTrocaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTroca.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTroca))
            )
            .andExpect(status().isOk());

        // Validate the Troca in the database
        List<Troca> trocaList = trocaRepository.findAll();
        assertThat(trocaList).hasSize(databaseSizeBeforeUpdate);
        Troca testTroca = trocaList.get(trocaList.size() - 1);
        assertThat(testTroca.getDataInicio()).isEqualTo(UPDATED_DATA_INICIO);
        assertThat(testTroca.getDataFim()).isEqualTo(UPDATED_DATA_FIM);
        assertThat(testTroca.getResultado()).isEqualTo(UPDATED_RESULTADO);
    }

    @Test
    @Transactional
    void putNonExistingTroca() throws Exception {
        int databaseSizeBeforeUpdate = trocaRepository.findAll().size();
        troca.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTrocaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, troca.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(troca))
            )
            .andExpect(status().isBadRequest());

        // Validate the Troca in the database
        List<Troca> trocaList = trocaRepository.findAll();
        assertThat(trocaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTroca() throws Exception {
        int databaseSizeBeforeUpdate = trocaRepository.findAll().size();
        troca.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrocaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(troca))
            )
            .andExpect(status().isBadRequest());

        // Validate the Troca in the database
        List<Troca> trocaList = trocaRepository.findAll();
        assertThat(trocaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTroca() throws Exception {
        int databaseSizeBeforeUpdate = trocaRepository.findAll().size();
        troca.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrocaMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(troca))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Troca in the database
        List<Troca> trocaList = trocaRepository.findAll();
        assertThat(trocaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTrocaWithPatch() throws Exception {
        // Initialize the database
        trocaRepository.saveAndFlush(troca);

        int databaseSizeBeforeUpdate = trocaRepository.findAll().size();

        // Update the troca using partial update
        Troca partialUpdatedTroca = new Troca();
        partialUpdatedTroca.setId(troca.getId());

        partialUpdatedTroca.resultado(UPDATED_RESULTADO);

        restTrocaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTroca.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTroca))
            )
            .andExpect(status().isOk());

        // Validate the Troca in the database
        List<Troca> trocaList = trocaRepository.findAll();
        assertThat(trocaList).hasSize(databaseSizeBeforeUpdate);
        Troca testTroca = trocaList.get(trocaList.size() - 1);
        assertThat(testTroca.getDataInicio()).isEqualTo(DEFAULT_DATA_INICIO);
        assertThat(testTroca.getDataFim()).isEqualTo(DEFAULT_DATA_FIM);
        assertThat(testTroca.getResultado()).isEqualTo(UPDATED_RESULTADO);
    }

    @Test
    @Transactional
    void fullUpdateTrocaWithPatch() throws Exception {
        // Initialize the database
        trocaRepository.saveAndFlush(troca);

        int databaseSizeBeforeUpdate = trocaRepository.findAll().size();

        // Update the troca using partial update
        Troca partialUpdatedTroca = new Troca();
        partialUpdatedTroca.setId(troca.getId());

        partialUpdatedTroca.dataInicio(UPDATED_DATA_INICIO).dataFim(UPDATED_DATA_FIM).resultado(UPDATED_RESULTADO);

        restTrocaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTroca.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTroca))
            )
            .andExpect(status().isOk());

        // Validate the Troca in the database
        List<Troca> trocaList = trocaRepository.findAll();
        assertThat(trocaList).hasSize(databaseSizeBeforeUpdate);
        Troca testTroca = trocaList.get(trocaList.size() - 1);
        assertThat(testTroca.getDataInicio()).isEqualTo(UPDATED_DATA_INICIO);
        assertThat(testTroca.getDataFim()).isEqualTo(UPDATED_DATA_FIM);
        assertThat(testTroca.getResultado()).isEqualTo(UPDATED_RESULTADO);
    }

    @Test
    @Transactional
    void patchNonExistingTroca() throws Exception {
        int databaseSizeBeforeUpdate = trocaRepository.findAll().size();
        troca.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTrocaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, troca.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(troca))
            )
            .andExpect(status().isBadRequest());

        // Validate the Troca in the database
        List<Troca> trocaList = trocaRepository.findAll();
        assertThat(trocaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTroca() throws Exception {
        int databaseSizeBeforeUpdate = trocaRepository.findAll().size();
        troca.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrocaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(troca))
            )
            .andExpect(status().isBadRequest());

        // Validate the Troca in the database
        List<Troca> trocaList = trocaRepository.findAll();
        assertThat(trocaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTroca() throws Exception {
        int databaseSizeBeforeUpdate = trocaRepository.findAll().size();
        troca.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrocaMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(troca))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Troca in the database
        List<Troca> trocaList = trocaRepository.findAll();
        assertThat(trocaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTroca() throws Exception {
        // Initialize the database
        trocaRepository.saveAndFlush(troca);

        int databaseSizeBeforeDelete = trocaRepository.findAll().size();

        // Delete the troca
        restTrocaMockMvc
            .perform(delete(ENTITY_API_URL_ID, troca.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Troca> trocaList = trocaRepository.findAll();
        assertThat(trocaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
