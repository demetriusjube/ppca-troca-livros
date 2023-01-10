package br.unb.ppca.trocalivros.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.unb.ppca.trocalivros.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ItemDesejadoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ItemDesejado.class);
        ItemDesejado itemDesejado1 = new ItemDesejado();
        itemDesejado1.setId(1L);
        ItemDesejado itemDesejado2 = new ItemDesejado();
        itemDesejado2.setId(itemDesejado1.getId());
        assertThat(itemDesejado1).isEqualTo(itemDesejado2);
        itemDesejado2.setId(2L);
        assertThat(itemDesejado1).isNotEqualTo(itemDesejado2);
        itemDesejado1.setId(null);
        assertThat(itemDesejado1).isNotEqualTo(itemDesejado2);
    }
}
