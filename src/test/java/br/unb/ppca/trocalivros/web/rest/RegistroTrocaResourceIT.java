package br.unb.ppca.trocalivros.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.unb.ppca.trocalivros.IntegrationTest;
import br.unb.ppca.trocalivros.domain.RegistroTroca;
import br.unb.ppca.trocalivros.repository.RegistroTrocaRepository;
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

/**
 * Integration tests for the {@link RegistroTrocaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RegistroTrocaResourceIT {

    private static final Boolean DEFAULT_ACEITE = false;
    private static final Boolean UPDATED_ACEITE = true;

    private static final String ENTITY_API_URL = "/api/registro-trocas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RegistroTrocaRepository registroTrocaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRegistroTrocaMockMvc;

    private RegistroTroca registroTroca;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RegistroTroca createEntity(EntityManager em) {
        RegistroTroca registroTroca = new RegistroTroca().aceite(DEFAULT_ACEITE);
        return registroTroca;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RegistroTroca createUpdatedEntity(EntityManager em) {
        RegistroTroca registroTroca = new RegistroTroca().aceite(UPDATED_ACEITE);
        return registroTroca;
    }

    @BeforeEach
    public void initTest() {
        registroTroca = createEntity(em);
    }

    @Test
    @Transactional
    void createRegistroTroca() throws Exception {
        int databaseSizeBeforeCreate = registroTrocaRepository.findAll().size();
        // Create the RegistroTroca
        restRegistroTrocaMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(registroTroca))
            )
            .andExpect(status().isCreated());

        // Validate the RegistroTroca in the database
        List<RegistroTroca> registroTrocaList = registroTrocaRepository.findAll();
        assertThat(registroTrocaList).hasSize(databaseSizeBeforeCreate + 1);
        RegistroTroca testRegistroTroca = registroTrocaList.get(registroTrocaList.size() - 1);
        assertThat(testRegistroTroca.getAceite()).isEqualTo(DEFAULT_ACEITE);
    }

    @Test
    @Transactional
    void createRegistroTrocaWithExistingId() throws Exception {
        // Create the RegistroTroca with an existing ID
        registroTroca.setId(1L);

        int databaseSizeBeforeCreate = registroTrocaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRegistroTrocaMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(registroTroca))
            )
            .andExpect(status().isBadRequest());

        // Validate the RegistroTroca in the database
        List<RegistroTroca> registroTrocaList = registroTrocaRepository.findAll();
        assertThat(registroTrocaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRegistroTrocas() throws Exception {
        // Initialize the database
        registroTrocaRepository.saveAndFlush(registroTroca);

        // Get all the registroTrocaList
        restRegistroTrocaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(registroTroca.getId().intValue())))
            .andExpect(jsonPath("$.[*].aceite").value(hasItem(DEFAULT_ACEITE.booleanValue())));
    }

    @Test
    @Transactional
    void getRegistroTroca() throws Exception {
        // Initialize the database
        registroTrocaRepository.saveAndFlush(registroTroca);

        // Get the registroTroca
        restRegistroTrocaMockMvc
            .perform(get(ENTITY_API_URL_ID, registroTroca.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(registroTroca.getId().intValue()))
            .andExpect(jsonPath("$.aceite").value(DEFAULT_ACEITE.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingRegistroTroca() throws Exception {
        // Get the registroTroca
        restRegistroTrocaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRegistroTroca() throws Exception {
        // Initialize the database
        registroTrocaRepository.saveAndFlush(registroTroca);

        int databaseSizeBeforeUpdate = registroTrocaRepository.findAll().size();

        // Update the registroTroca
        RegistroTroca updatedRegistroTroca = registroTrocaRepository.findById(registroTroca.getId()).get();
        // Disconnect from session so that the updates on updatedRegistroTroca are not directly saved in db
        em.detach(updatedRegistroTroca);
        updatedRegistroTroca.aceite(UPDATED_ACEITE);

        restRegistroTrocaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRegistroTroca.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRegistroTroca))
            )
            .andExpect(status().isOk());

        // Validate the RegistroTroca in the database
        List<RegistroTroca> registroTrocaList = registroTrocaRepository.findAll();
        assertThat(registroTrocaList).hasSize(databaseSizeBeforeUpdate);
        RegistroTroca testRegistroTroca = registroTrocaList.get(registroTrocaList.size() - 1);
        assertThat(testRegistroTroca.getAceite()).isEqualTo(UPDATED_ACEITE);
    }

    @Test
    @Transactional
    void putNonExistingRegistroTroca() throws Exception {
        int databaseSizeBeforeUpdate = registroTrocaRepository.findAll().size();
        registroTroca.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRegistroTrocaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, registroTroca.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(registroTroca))
            )
            .andExpect(status().isBadRequest());

        // Validate the RegistroTroca in the database
        List<RegistroTroca> registroTrocaList = registroTrocaRepository.findAll();
        assertThat(registroTrocaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRegistroTroca() throws Exception {
        int databaseSizeBeforeUpdate = registroTrocaRepository.findAll().size();
        registroTroca.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegistroTrocaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(registroTroca))
            )
            .andExpect(status().isBadRequest());

        // Validate the RegistroTroca in the database
        List<RegistroTroca> registroTrocaList = registroTrocaRepository.findAll();
        assertThat(registroTrocaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRegistroTroca() throws Exception {
        int databaseSizeBeforeUpdate = registroTrocaRepository.findAll().size();
        registroTroca.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegistroTrocaMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(registroTroca))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RegistroTroca in the database
        List<RegistroTroca> registroTrocaList = registroTrocaRepository.findAll();
        assertThat(registroTrocaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRegistroTrocaWithPatch() throws Exception {
        // Initialize the database
        registroTrocaRepository.saveAndFlush(registroTroca);

        int databaseSizeBeforeUpdate = registroTrocaRepository.findAll().size();

        // Update the registroTroca using partial update
        RegistroTroca partialUpdatedRegistroTroca = new RegistroTroca();
        partialUpdatedRegistroTroca.setId(registroTroca.getId());

        partialUpdatedRegistroTroca.aceite(UPDATED_ACEITE);

        restRegistroTrocaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRegistroTroca.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRegistroTroca))
            )
            .andExpect(status().isOk());

        // Validate the RegistroTroca in the database
        List<RegistroTroca> registroTrocaList = registroTrocaRepository.findAll();
        assertThat(registroTrocaList).hasSize(databaseSizeBeforeUpdate);
        RegistroTroca testRegistroTroca = registroTrocaList.get(registroTrocaList.size() - 1);
        assertThat(testRegistroTroca.getAceite()).isEqualTo(UPDATED_ACEITE);
    }

    @Test
    @Transactional
    void fullUpdateRegistroTrocaWithPatch() throws Exception {
        // Initialize the database
        registroTrocaRepository.saveAndFlush(registroTroca);

        int databaseSizeBeforeUpdate = registroTrocaRepository.findAll().size();

        // Update the registroTroca using partial update
        RegistroTroca partialUpdatedRegistroTroca = new RegistroTroca();
        partialUpdatedRegistroTroca.setId(registroTroca.getId());

        partialUpdatedRegistroTroca.aceite(UPDATED_ACEITE);

        restRegistroTrocaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRegistroTroca.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRegistroTroca))
            )
            .andExpect(status().isOk());

        // Validate the RegistroTroca in the database
        List<RegistroTroca> registroTrocaList = registroTrocaRepository.findAll();
        assertThat(registroTrocaList).hasSize(databaseSizeBeforeUpdate);
        RegistroTroca testRegistroTroca = registroTrocaList.get(registroTrocaList.size() - 1);
        assertThat(testRegistroTroca.getAceite()).isEqualTo(UPDATED_ACEITE);
    }

    @Test
    @Transactional
    void patchNonExistingRegistroTroca() throws Exception {
        int databaseSizeBeforeUpdate = registroTrocaRepository.findAll().size();
        registroTroca.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRegistroTrocaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, registroTroca.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(registroTroca))
            )
            .andExpect(status().isBadRequest());

        // Validate the RegistroTroca in the database
        List<RegistroTroca> registroTrocaList = registroTrocaRepository.findAll();
        assertThat(registroTrocaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRegistroTroca() throws Exception {
        int databaseSizeBeforeUpdate = registroTrocaRepository.findAll().size();
        registroTroca.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegistroTrocaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(registroTroca))
            )
            .andExpect(status().isBadRequest());

        // Validate the RegistroTroca in the database
        List<RegistroTroca> registroTrocaList = registroTrocaRepository.findAll();
        assertThat(registroTrocaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRegistroTroca() throws Exception {
        int databaseSizeBeforeUpdate = registroTrocaRepository.findAll().size();
        registroTroca.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegistroTrocaMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(registroTroca))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RegistroTroca in the database
        List<RegistroTroca> registroTrocaList = registroTrocaRepository.findAll();
        assertThat(registroTrocaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRegistroTroca() throws Exception {
        // Initialize the database
        registroTrocaRepository.saveAndFlush(registroTroca);

        int databaseSizeBeforeDelete = registroTrocaRepository.findAll().size();

        // Delete the registroTroca
        restRegistroTrocaMockMvc
            .perform(delete(ENTITY_API_URL_ID, registroTroca.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RegistroTroca> registroTrocaList = registroTrocaRepository.findAll();
        assertThat(registroTrocaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
