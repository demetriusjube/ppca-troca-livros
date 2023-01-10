package br.unb.ppca.trocalivros.repository;

import br.unb.ppca.trocalivros.domain.Troca;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Troca entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TrocaRepository extends JpaRepository<Troca, Long> {}
