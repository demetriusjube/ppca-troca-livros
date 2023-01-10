package br.unb.ppca.trocalivros.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.unb.ppca.trocalivros.IntegrationTest;
import br.unb.ppca.trocalivros.domain.ItemTroca;
import br.unb.ppca.trocalivros.domain.enumeration.SituacaoItem;
import br.unb.ppca.trocalivros.repository.ItemTrocaRepository;
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
 * Integration tests for the {@link ItemTrocaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ItemTrocaResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_ID_GLOBAL = "AAAAAAAAAA";
    private static final String UPDATED_ID_GLOBAL = "BBBBBBBBBB";

    private static final SituacaoItem DEFAULT_SITUACAO = SituacaoItem.DISPONIVEL;
    private static final SituacaoItem UPDATED_SITUACAO = SituacaoItem.INDISPONIVEL;

    private static final String ENTITY_API_URL = "/api/item-trocas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ItemTrocaRepository itemTrocaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restItemTrocaMockMvc;

    private ItemTroca itemTroca;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItemTroca createEntity(EntityManager em) {
        ItemTroca itemTroca = new ItemTroca().nome(DEFAULT_NOME).idGlobal(DEFAULT_ID_GLOBAL).situacao(DEFAULT_SITUACAO);
        return itemTroca;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItemTroca createUpdatedEntity(EntityManager em) {
        ItemTroca itemTroca = new ItemTroca().nome(UPDATED_NOME).idGlobal(UPDATED_ID_GLOBAL).situacao(UPDATED_SITUACAO);
        return itemTroca;
    }

    @BeforeEach
    public void initTest() {
        itemTroca = createEntity(em);
    }

    @Test
    @Transactional
    void createItemTroca() throws Exception {
        int databaseSizeBeforeCreate = itemTrocaRepository.findAll().size();
        // Create the ItemTroca
        restItemTrocaMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemTroca))
            )
            .andExpect(status().isCreated());

        // Validate the ItemTroca in the database
        List<ItemTroca> itemTrocaList = itemTrocaRepository.findAll();
        assertThat(itemTrocaList).hasSize(databaseSizeBeforeCreate + 1);
        ItemTroca testItemTroca = itemTrocaList.get(itemTrocaList.size() - 1);
        assertThat(testItemTroca.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testItemTroca.getIdGlobal()).isEqualTo(DEFAULT_ID_GLOBAL);
        assertThat(testItemTroca.getSituacao()).isEqualTo(DEFAULT_SITUACAO);
    }

    @Test
    @Transactional
    void createItemTrocaWithExistingId() throws Exception {
        // Create the ItemTroca with an existing ID
        itemTroca.setId(1L);

        int databaseSizeBeforeCreate = itemTrocaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restItemTrocaMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemTroca))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemTroca in the database
        List<ItemTroca> itemTrocaList = itemTrocaRepository.findAll();
        assertThat(itemTrocaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllItemTrocas() throws Exception {
        // Initialize the database
        itemTrocaRepository.saveAndFlush(itemTroca);

        // Get all the itemTrocaList
        restItemTrocaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(itemTroca.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].idGlobal").value(hasItem(DEFAULT_ID_GLOBAL)))
            .andExpect(jsonPath("$.[*].situacao").value(hasItem(DEFAULT_SITUACAO.toString())));
    }

    @Test
    @Transactional
    void getItemTroca() throws Exception {
        // Initialize the database
        itemTrocaRepository.saveAndFlush(itemTroca);

        // Get the itemTroca
        restItemTrocaMockMvc
            .perform(get(ENTITY_API_URL_ID, itemTroca.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(itemTroca.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.idGlobal").value(DEFAULT_ID_GLOBAL))
            .andExpect(jsonPath("$.situacao").value(DEFAULT_SITUACAO.toString()));
    }

    @Test
    @Transactional
    void getNonExistingItemTroca() throws Exception {
        // Get the itemTroca
        restItemTrocaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingItemTroca() throws Exception {
        // Initialize the database
        itemTrocaRepository.saveAndFlush(itemTroca);

        int databaseSizeBeforeUpdate = itemTrocaRepository.findAll().size();

        // Update the itemTroca
        ItemTroca updatedItemTroca = itemTrocaRepository.findById(itemTroca.getId()).get();
        // Disconnect from session so that the updates on updatedItemTroca are not directly saved in db
        em.detach(updatedItemTroca);
        updatedItemTroca.nome(UPDATED_NOME).idGlobal(UPDATED_ID_GLOBAL).situacao(UPDATED_SITUACAO);

        restItemTrocaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedItemTroca.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedItemTroca))
            )
            .andExpect(status().isOk());

        // Validate the ItemTroca in the database
        List<ItemTroca> itemTrocaList = itemTrocaRepository.findAll();
        assertThat(itemTrocaList).hasSize(databaseSizeBeforeUpdate);
        ItemTroca testItemTroca = itemTrocaList.get(itemTrocaList.size() - 1);
        assertThat(testItemTroca.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testItemTroca.getIdGlobal()).isEqualTo(UPDATED_ID_GLOBAL);
        assertThat(testItemTroca.getSituacao()).isEqualTo(UPDATED_SITUACAO);
    }

    @Test
    @Transactional
    void putNonExistingItemTroca() throws Exception {
        int databaseSizeBeforeUpdate = itemTrocaRepository.findAll().size();
        itemTroca.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemTrocaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, itemTroca.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemTroca))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemTroca in the database
        List<ItemTroca> itemTrocaList = itemTrocaRepository.findAll();
        assertThat(itemTrocaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchItemTroca() throws Exception {
        int databaseSizeBeforeUpdate = itemTrocaRepository.findAll().size();
        itemTroca.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemTrocaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemTroca))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemTroca in the database
        List<ItemTroca> itemTrocaList = itemTrocaRepository.findAll();
        assertThat(itemTrocaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamItemTroca() throws Exception {
        int databaseSizeBeforeUpdate = itemTrocaRepository.findAll().size();
        itemTroca.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemTrocaMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemTroca))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItemTroca in the database
        List<ItemTroca> itemTrocaList = itemTrocaRepository.findAll();
        assertThat(itemTrocaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateItemTrocaWithPatch() throws Exception {
        // Initialize the database
        itemTrocaRepository.saveAndFlush(itemTroca);

        int databaseSizeBeforeUpdate = itemTrocaRepository.findAll().size();

        // Update the itemTroca using partial update
        ItemTroca partialUpdatedItemTroca = new ItemTroca();
        partialUpdatedItemTroca.setId(itemTroca.getId());

        partialUpdatedItemTroca.idGlobal(UPDATED_ID_GLOBAL).situacao(UPDATED_SITUACAO);

        restItemTrocaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItemTroca.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItemTroca))
            )
            .andExpect(status().isOk());

        // Validate the ItemTroca in the database
        List<ItemTroca> itemTrocaList = itemTrocaRepository.findAll();
        assertThat(itemTrocaList).hasSize(databaseSizeBeforeUpdate);
        ItemTroca testItemTroca = itemTrocaList.get(itemTrocaList.size() - 1);
        assertThat(testItemTroca.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testItemTroca.getIdGlobal()).isEqualTo(UPDATED_ID_GLOBAL);
        assertThat(testItemTroca.getSituacao()).isEqualTo(UPDATED_SITUACAO);
    }

    @Test
    @Transactional
    void fullUpdateItemTrocaWithPatch() throws Exception {
        // Initialize the database
        itemTrocaRepository.saveAndFlush(itemTroca);

        int databaseSizeBeforeUpdate = itemTrocaRepository.findAll().size();

        // Update the itemTroca using partial update
        ItemTroca partialUpdatedItemTroca = new ItemTroca();
        partialUpdatedItemTroca.setId(itemTroca.getId());

        partialUpdatedItemTroca.nome(UPDATED_NOME).idGlobal(UPDATED_ID_GLOBAL).situacao(UPDATED_SITUACAO);

        restItemTrocaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItemTroca.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItemTroca))
            )
            .andExpect(status().isOk());

        // Validate the ItemTroca in the database
        List<ItemTroca> itemTrocaList = itemTrocaRepository.findAll();
        assertThat(itemTrocaList).hasSize(databaseSizeBeforeUpdate);
        ItemTroca testItemTroca = itemTrocaList.get(itemTrocaList.size() - 1);
        assertThat(testItemTroca.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testItemTroca.getIdGlobal()).isEqualTo(UPDATED_ID_GLOBAL);
        assertThat(testItemTroca.getSituacao()).isEqualTo(UPDATED_SITUACAO);
    }

    @Test
    @Transactional
    void patchNonExistingItemTroca() throws Exception {
        int databaseSizeBeforeUpdate = itemTrocaRepository.findAll().size();
        itemTroca.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemTrocaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, itemTroca.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itemTroca))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemTroca in the database
        List<ItemTroca> itemTrocaList = itemTrocaRepository.findAll();
        assertThat(itemTrocaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchItemTroca() throws Exception {
        int databaseSizeBeforeUpdate = itemTrocaRepository.findAll().size();
        itemTroca.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemTrocaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itemTroca))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemTroca in the database
        List<ItemTroca> itemTrocaList = itemTrocaRepository.findAll();
        assertThat(itemTrocaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamItemTroca() throws Exception {
        int databaseSizeBeforeUpdate = itemTrocaRepository.findAll().size();
        itemTroca.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemTrocaMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itemTroca))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItemTroca in the database
        List<ItemTroca> itemTrocaList = itemTrocaRepository.findAll();
        assertThat(itemTrocaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteItemTroca() throws Exception {
        // Initialize the database
        itemTrocaRepository.saveAndFlush(itemTroca);

        int databaseSizeBeforeDelete = itemTrocaRepository.findAll().size();

        // Delete the itemTroca
        restItemTrocaMockMvc
            .perform(delete(ENTITY_API_URL_ID, itemTroca.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ItemTroca> itemTrocaList = itemTrocaRepository.findAll();
        assertThat(itemTrocaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
