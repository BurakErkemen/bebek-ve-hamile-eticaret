import type { SliderAdminRepository } from "@/server/domain/repositories/slider-admin.repository";
import type { SliderAdminInput, SliderSlideAdminInput } from "@/server/domain/entities/slider-admin.entity";

export class ListSlidersUseCase {
  constructor(private readonly repo: SliderAdminRepository) {}
  execute() { return this.repo.listSliders(); }
}

export class GetSliderAdminUseCase {
  constructor(private readonly repo: SliderAdminRepository) {}
  execute(id: string) { return this.repo.findSliderById(id); }
}

export class CreateSliderUseCase {
  constructor(private readonly repo: SliderAdminRepository) {}
  execute(input: SliderAdminInput) { return this.repo.createSlider(input); }
}

export class UpdateSliderUseCase {
  constructor(private readonly repo: SliderAdminRepository) {}
  execute(id: string, input: SliderAdminInput) { return this.repo.updateSlider(id, input); }
}

export class DeleteSliderUseCase {
  constructor(private readonly repo: SliderAdminRepository) {}
  execute(id: string) { return this.repo.deleteSlider(id); }
}

export class CreateSlideUseCase {
  constructor(private readonly repo: SliderAdminRepository) {}
  execute(sliderId: string, input: SliderSlideAdminInput) { return this.repo.createSlide(sliderId, input); }
}

export class UpdateSlideUseCase {
  constructor(private readonly repo: SliderAdminRepository) {}
  execute(id: string, input: SliderSlideAdminInput) { return this.repo.updateSlide(id, input); }
}

export class DeleteSlideUseCase {
  constructor(private readonly repo: SliderAdminRepository) {}
  execute(id: string) { return this.repo.deleteSlide(id); }
}
