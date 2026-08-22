package com.buylogic.repository.global;

import java.util.List;

import com.buylogic.model.ProductComposition;
import com.buylogic.repository.GenericRepository;

public interface ProductCompositionRepository extends GenericRepository<ProductComposition, Integer> {

    // Récupérer tous les composants d'un produit fabriqué (ex: la liste des ingrédients de la baguette)
    List<ProductComposition> findAllByParentProduct_IdProduct(Integer parentProductId);

    // Savoir dans quels produits un composant est utilisé (ex: dans quelles recettes on met de la farine)
    List<ProductComposition> findAllByChildProduct_IdProduct(Integer childProductId);

    // Supprimer tous les composants liés à un produit parent (pratique si on met à jour la recette en remplaçant tout)
    void deleteAllByParentProduct_IdProduct(Integer parentProductId);

    long deleteByParentProduct_IdProductAndChildProduct_IdProduct(Integer parentId, Integer childId);
}