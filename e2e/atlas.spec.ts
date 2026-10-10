import { test, expect, type Page } from '@playwright/test';
import { DOMAINS } from '../src/data';

async function dismissIntro(page: Page) {
  const explorer = page.getByRole('button', { name: 'Explorer' });
  if (await explorer.isVisible().catch(() => false)) await explorer.click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await dismissIntro(page);
});

test('la page charge et affiche les territoires', async ({ page }, testInfo) => {
  await expect(page.locator('[data-testid="territory"]')).toHaveCount(DOMAINS.length);
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `e2e/artifacts/${testInfo.project.name}-vue-initiale.png` });
});

test('clic territoire → panneau Géométrie grecque', async ({ page }, testInfo) => {
  await page.locator('[data-testid="territory"][data-id="geometrie-grecque"]').click({ force: true });
  if (testInfo.project.name === 'mobile') {
    await expect(page.locator('[data-testid="panel-sheet"]')).toBeVisible();
    await expect(page.locator('[data-testid="panel-sheet"]')).toContainText('Géométrie grecque');
  } else {
    await expect(page.locator('[data-testid="panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="panel"]')).toContainText('Géométrie grecque');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'e2e/artifacts/desktop-niveau1-geometrie-grecque.png' });
  }
});

test('recherche « gauss » → mathématicien + hash', async ({ page }) => {
  const inline = page.getByRole('combobox').first();
  if (!(await inline.isVisible().catch(() => false))) {
    await page.locator('[data-testid="search-open"]').click();
  }
  await page.getByRole('combobox').fill('gauss');
  await page.getByRole('option', { name: /Carl Friedrich Gauss/ }).first().click();
  const panel = page.locator('[data-testid="panel"], [data-testid="panel-sheet"]');
  await expect(panel).toContainText('Carl Friedrich Gauss');
  await expect(page).toHaveURL(/#\/mathematicien\/gauss/);
});

test('navigation directe #/resultat/elements-euclide', async ({ page }, testInfo) => {
  await page.goto('/#/resultat/elements-euclide');
  await dismissIntro(page);
  const panel = page.locator('[data-testid="panel"], [data-testid="panel-sheet"]');
  await expect(panel).toContainText('Éléments');
  await expect(panel).toContainText('Euclide');
  if (testInfo.project.name === 'desktop') {
    await page.waitForTimeout(1100);
    await page.screenshot({ path: 'e2e/artifacts/desktop-niveau3-resultat.png' });
  }
});

test('filtre période 1900–1930 estompe la géométrie grecque, pas la topologie', async ({ page }) => {
  await page.getByRole('button', { name: 'Filtres' }).click();
  const drawer = page.locator('aside[aria-label="Filtres"]');
  await expect(drawer).toBeVisible();
  const start = drawer.getByLabel(/Année de début/);
  const end = drawer.getByLabel(/Année de fin/);
  await start.fill('1900');
  await end.fill('1930');
  await expect(page.locator('[data-testid="territory"][data-id="geometrie-grecque"]')).toHaveClass(/dimmed/);
  await expect(page.locator('[data-testid="territory"][data-id="topologie"]')).not.toHaveClass(/dimmed/);
});

test('filtre période avant notre ère : −600 → −200 garde la géométrie grecque', async ({ page }) => {
  await page.getByRole('button', { name: 'Filtres' }).click();
  const drawer = page.locator('aside[aria-label="Filtres"]');
  await drawer.getByLabel(/Année de début/).fill('-600');
  await drawer.getByLabel(/Année de fin/).fill('-200');
  await expect(page.locator('[data-testid="territory"][data-id="geometrie-grecque"]')).not.toHaveClass(/dimmed/);
  await expect(page.locator('[data-testid="territory"][data-id="topologie"]')).toHaveClass(/dimmed/);
});

test('mobile : bottom sheet après sélection', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile uniquement');
  await page.locator('[data-testid="territory"][data-id="geometrie-grecque"]').click({ force: true });
  await expect(page.locator('[data-testid="panel-sheet"]')).toBeVisible();
  // attendre la fin du fly-to : le zoom dépasse nettement l'ajustement initial
  await expect
    .poll(
      async () => {
        const t = (await page.locator('g.world').getAttribute('transform')) ?? '';
        const m = /scale\(([\d.]+)\)/.exec(t);
        return m ? Number(m[1]) : 0;
      },
      { timeout: 3000 },
    )
    .toBeGreaterThan(0.2);
  await page.waitForTimeout(1300);
  await page.screenshot({ path: 'e2e/artifacts/mobile-territoire-selectionne.png' });
});

test('mobile : recherche en overlay', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile uniquement');
  await page.locator('[data-testid="search-open"]').click();
  await expect(page.locator('[data-testid="search-overlay"]')).toBeVisible();
  await page.locator('[data-testid="search-overlay"]').getByRole('combobox').fill('gauss');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'e2e/artifacts/mobile-recherche.png' });
  await page
    .locator('[data-testid="search-overlay"]')
    .getByRole('option', { name: /Carl Friedrich Gauss/ })
    .first()
    .click();
  await expect(page.locator('[data-testid="panel-sheet"]')).toContainText('Carl Friedrich Gauss');
});

test('mathématicien : section Réseau et arcs sur la carte', async ({ page }, testInfo) => {
  await page.goto('/#/mathematicien/hilbert');
  await dismissIntro(page);
  const panel = page.locator('[data-testid="panel"], [data-testid="panel-sheet"]');
  await expect(panel).toContainText('David Hilbert');
  await expect(panel).toContainText('Réseau');
  // les arcs entre figures apparaissent quand une figure est sélectionnée
  await expect(page.locator('.mlinks .mlink')).not.toHaveCount(0);
  if (testInfo.project.name === 'desktop') {
    await page.waitForTimeout(1300);
    await page.screenshot({ path: 'e2e/artifacts/desktop-reseau-hilbert.png' });
  }
});

test('domaine contemporain : complexité et informatique théorique', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'mobile') {
    // le territoire est hors du viewport initial en portrait : navigation directe
    await page.goto('/#/domaine/complexite-et-informatique-theorique');
    await dismissIntro(page);
  } else {
    await page.locator('[data-testid="territory"][data-id="complexite-et-informatique-theorique"]').click({ force: true });
  }
  const panel = page.locator('[data-testid="panel"], [data-testid="panel-sheet"]');
  await expect(panel).toContainText('Complexité');
  await expect(panel).toContainText('Cook');
  if (testInfo.project.name === 'desktop') {
    await page.waitForTimeout(1100);
    await page.screenshot({ path: 'e2e/artifacts/desktop-niveau1-complexite.png' });
  }
});

test('fleuves et frise : un fleuve par champ, la frise déplace la carte dans le temps', async ({ page }) => {
  await expect(page.locator('.rivers .river')).toHaveCount(5);
  const slider = page.getByRole('slider');
  await expect(slider).toBeVisible();
  const box = (await slider.boundingBox())!;
  const yearAt = async () => Number(await slider.getAttribute('aria-valuenow'));
  await page.mouse.click(box.x + box.width * 0.15, box.y + box.height / 2);
  await page.waitForTimeout(700);
  const early = await yearAt();
  await page.mouse.click(box.x + box.width * 0.85, box.y + box.height / 2);
  await expect.poll(yearAt, { timeout: 3000 }).toBeGreaterThan(early);
});

test('bassin amont : la fiche liste les affluents, la carte les allume', async ({ page }, testInfo) => {
  await page.goto('/#/domaine/analyse-rigoureuse');
  await dismissIntro(page);
  const upstream = page.locator('[data-testid="upstream"]');
  await expect(upstream).toBeVisible();
  await expect(upstream).toContainText('querelle des infiniment petits');
  await expect(page.locator('[data-testid="territory"].chain-up')).not.toHaveCount(0);
  await expect(page.locator('.link-group.chain-link')).not.toHaveCount(0);
  // un affluent est cliquable : il devient le domaine choisi
  await upstream.getByRole('button', { name: /querelle des infiniment petits/ }).click();
  await expect(page).toHaveURL(/#\/domaine\/querelle-des-infiniment-petits/);
  if (testInfo.project.name === 'desktop') {
    await page.waitForTimeout(1100);
    await page.screenshot({ path: 'e2e/artifacts/desktop-bassin-amont.png' });
  }
});

test('résultat : récits sourcés « ce qui y a conduit » et « ce que ça a ouvert »', async ({ page }) => {
  await page.goto('/#/resultat/petit-theoreme-de-fermat');
  await dismissIntro(page);
  const roots = page.locator('[data-testid="result-context"]');
  await expect(roots).toBeVisible();
  await expect(roots.locator('.badge-fait, .badge-interp').first()).toBeVisible();
  await expect(page.locator('[data-testid="result-impact"]').locator('.badge-fait, .badge-interp').first()).toBeVisible();
});

test('intro : affichage, fermeture, persistance', async ({ page, context }) => {
  await context.clearCookies();
  await page.evaluate(() => localStorage.clear());
  await page.goto('/');
  const dialog = page.getByRole('dialog', { name: 'Introduction' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Explorer' }).click();
  await expect(dialog).toBeHidden();
  await page.reload();
  await expect(page.getByRole('dialog', { name: 'Introduction' })).toHaveCount(0);
});

test('langue : ?lang=en bascule l’UI, le sélecteur revient en FR', async ({ page }) => {
  await page.goto('/?lang=en');
  await dismissIntro(page);
  await expect(page.getByRole('button', { name: 'Filters' }).first()).toBeVisible();
  await expect(page).toHaveURL(/lang=en/);
  await page.getByRole('group', { name: 'Langue / Language' }).first().getByRole('button', { name: 'fr', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Filtres' }).first()).toBeVisible();
  await expect(page).toHaveURL(/lang=fr/);
});
