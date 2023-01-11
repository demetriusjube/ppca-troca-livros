package br.unb.ppca.trocalivros.repository;

import br.unb.ppca.trocalivros.domain.ItemDesejado;
import br.unb.ppca.trocalivros.domain.User;
import br.unb.ppca.trocalivros.domain.enumeration.SituacaoItem;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ItemDesejado entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ItemDesejadoRepository extends JpaRepository<ItemDesejado, Long> {
    @Query("select itemDesejado from ItemDesejado itemDesejado where itemDesejado.user.login = ?#{principal.username}")
    List<ItemDesejado> findByUserIsCurrentUser();
    
    List<ItemDesejado> findByUserEqualsAndSituacaoEquals(User user, SituacaoItem situacaoItem);
}
