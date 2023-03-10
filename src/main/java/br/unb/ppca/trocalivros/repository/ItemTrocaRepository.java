package br.unb.ppca.trocalivros.repository;

import br.unb.ppca.trocalivros.domain.ItemTroca;
import br.unb.ppca.trocalivros.domain.enumeration.SituacaoItem;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ItemTroca entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ItemTrocaRepository extends JpaRepository<ItemTroca, Long> {
	@Query("select itemTroca from ItemTroca itemTroca where itemTroca.user.login = ?#{principal.username}")
	List<ItemTroca> findByUserIsCurrentUser();

	List<ItemTroca> findBySituacaoEqualsAndUserIsNotNull(SituacaoItem situacaoItem);

	List<ItemTroca> findByIdGlobalEqualsAndUserLoginEqualsIgnoreCaseAndSituacaoEqualsOrderByIdAsc(String idGlobal, String login,
			SituacaoItem situacao);
}
