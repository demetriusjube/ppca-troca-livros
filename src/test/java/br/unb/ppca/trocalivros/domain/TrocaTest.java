package br.unb.ppca.trocalivros.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.unb.ppca.trocalivros.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TrocaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Troca.class);
        Troca troca1 = new Troca();
        troca1.setId(1L);
        Troca troca2 = new Troca();
        troca2.setId(troca1.getId());
        assertThat(troca1).isEqualTo(troca2);
        troca2.setId(2L);
        assertThat(troca1).isNotEqualTo(troca2);
        troca1.setId(null);
        assertThat(troca1).isNotEqualTo(troca2);
    }
}
